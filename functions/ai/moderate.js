/**
 * Cloudflare AI Content Moderation for Etherith
 * Screens public memories before adding to shared archive
 */

export async function onRequest(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        console.log('🛡️ Content moderation request received');

        const body = await request.json();
        const { memoryNote, fileName, fileType, cid } = body;

        if (!memoryNote) {
            return new Response(
                JSON.stringify({ error: 'Memory note is required for moderation' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`🔍 Moderating content: ${fileName} (${fileType})`);

        // Prepare moderation input
        const moderationInput = {
            text: memoryNote,
            // Add file context for better moderation
            context: `File: ${fileName} (${fileType}). User description: ${memoryNote}`
        };

        // Call Cloudflare AI for content moderation
        const aiResponse = await env.AI.run('@cf/openai/moderation', {
            input_text: moderationInput.context
        });

        console.log('🤖 AI moderation result:', aiResponse);

        // Analyze moderation results
        const categories = aiResponse.categories || {};
        const categoryScores = aiResponse.category_scores || {};

        // Define moderation thresholds
        const thresholds = {
            harassment: 0.8,
            'harassment/threatening': 0.7,
            hate: 0.8,
            'hate/threatening': 0.7,
            'self-harm': 0.6,
            'self-harm/intent': 0.6,
            'self-harm/instructions': 0.6,
            sexual: 0.9, // Allow some artistic content
            'sexual/minors': 0.1, // Very strict
            violence: 0.8,
            'violence/graphic': 0.7
        };

        // Check if content violates any policies
        const violations = [];
        let maxScore = 0;
        let rejected = false;

        for (const [category, flagged] of Object.entries(categories)) {
            const score = categoryScores[category] || 0;
            const threshold = thresholds[category] || 0.8;

            maxScore = Math.max(maxScore, score);

            if (flagged || score > threshold) {
                violations.push({
                    category,
                    score,
                    threshold,
                    flagged
                });
                rejected = true;
            }
        }

        // Additional custom checks for Etherith-specific content
        const customChecks = performCustomModeration(memoryNote, fileName);
        if (customChecks.violations.length > 0) {
            violations.push(...customChecks.violations);
            rejected = true;
        }

        // Create moderation result
        const result = {
            approved: !rejected,
            confidence: Math.max(maxScore, customChecks.maxScore),
            categories: categories,
            categoryScores: categoryScores,
            violations: violations,
            timestamp: new Date().toISOString(),
            moderator: 'Cloudflare AI + Custom Rules',
            customChecks: customChecks.checks
        };

        if (rejected) {
            console.log('❌ Content rejected:', violations);
            result.reason = violations.map(v => v.category).join(', ');
        } else {
            console.log('✅ Content approved for public archive');
        }

        return new Response(JSON.stringify({
            success: true,
            moderation: result,
            message: rejected ? 'Content did not pass moderation' : 'Content approved for public sharing'
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('❌ Moderation error:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: 'Moderation service temporarily unavailable',
                details: error.message
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

/**
 * Custom moderation rules specific to Etherith
 */
function performCustomModeration(memoryNote, fileName) {
    const violations = [];
    const checks = [];
    let maxScore = 0;

    // Check for spam patterns
    const spamCheck = checkSpam(memoryNote);
    checks.push(spamCheck);
    if (spamCheck.flagged) {
        violations.push({
            category: 'spam',
            score: spamCheck.score,
            threshold: 0.7,
            flagged: true
        });
        maxScore = Math.max(maxScore, spamCheck.score);
    }

    // Check for low-quality content
    const qualityCheck = checkQuality(memoryNote);
    checks.push(qualityCheck);
    if (qualityCheck.flagged) {
        violations.push({
            category: 'low-quality',
            score: qualityCheck.score,
            threshold: 0.8,
            flagged: true
        });
        maxScore = Math.max(maxScore, qualityCheck.score);
    }

    // Check for personal information
    const privacyCheck = checkPrivacy(memoryNote);
    checks.push(privacyCheck);
    if (privacyCheck.flagged) {
        violations.push({
            category: 'privacy-violation',
            score: privacyCheck.score,
            threshold: 0.6,
            flagged: true
        });
        maxScore = Math.max(maxScore, privacyCheck.score);
    }

    return { violations, checks, maxScore };
}

function checkSpam(text) {
    const spamPatterns = [
        /click here/gi,
        /buy now/gi,
        /limited time/gi,
        /act fast/gi,
        /free money/gi,
        /get rich quick/gi,
        /cryptocurrency.*investment/gi,
        /guaranteed profit/gi
    ];

    let spamScore = 0;
    const matches = [];

    spamPatterns.forEach(pattern => {
        if (pattern.test(text)) {
            spamScore += 0.3;
            matches.push(pattern.source);
        }
    });

    // Check for excessive repetition
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const maxRepetition = Math.max(...Object.values(wordFreq));
    if (maxRepetition > words.length * 0.3) {
        spamScore += 0.4;
        matches.push('excessive_repetition');
    }

    return {
        type: 'spam',
        score: Math.min(spamScore, 1.0),
        flagged: spamScore > 0.7,
        details: matches
    };
}

function checkQuality(text) {
    let qualityScore = 0;

    // Check length (too short or too long)
    if (text.length < 10) {
        qualityScore += 0.5;
    }
    if (text.length > 1000) {
        qualityScore += 0.3;
    }

    // Check for meaningful content
    const meaningfulWords = text.split(/\s+/).filter(word =>
        word.length > 3 && !/^\d+$/.test(word)
    );

    if (meaningfulWords.length < 3) {
        qualityScore += 0.4;
    }

    // Check for excessive special characters
    const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length;
    if (specialCharRatio > 0.3) {
        qualityScore += 0.3;
    }

    return {
        type: 'quality',
        score: Math.min(qualityScore, 1.0),
        flagged: qualityScore > 0.8,
        details: {
            length: text.length,
            meaningfulWords: meaningfulWords.length,
            specialCharRatio: specialCharRatio
        }
    };
}

function checkPrivacy(text) {
    const privacyPatterns = [
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
        /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
        /\b\d{3}-\d{3}-\d{4}\b/g, // Phone number
        /\b\d{1,5}\s\w+\s(street|st|avenue|ave|road|rd|drive|dr)\b/gi // Address
    ];

    let privacyScore = 0;
    const matches = [];

    privacyPatterns.forEach(pattern => {
        const found = text.match(pattern);
        if (found) {
            privacyScore += 0.4;
            matches.push(...found);
        }
    });

    return {
        type: 'privacy',
        score: Math.min(privacyScore, 1.0),
        flagged: privacyScore > 0.6,
        details: matches.length > 0 ? ['personal_information_detected'] : []
    };
}