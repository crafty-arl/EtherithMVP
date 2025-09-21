/**
 * Pinata IPFS Upload Handler for Etherith
 * Handles file uploads to IPFS via Pinata API
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
        console.log('📤 IPFS upload request received');

        // Parse multipart form data
        const formData = await request.formData();
        const file = formData.get('file');
        const metadata = formData.get('metadata');

        if (!file || !(file instanceof File)) {
            return new Response(
                JSON.stringify({ error: 'No file provided' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`📁 Processing file: ${file.name} (${file.size} bytes)`);

        // Parse metadata
        let memoryMetadata = {};
        try {
            memoryMetadata = metadata ? JSON.parse(metadata) : {};
        } catch (error) {
            console.warn('Invalid metadata format:', error);
        }

        // Prepare Pinata upload
        const pinataFormData = new FormData();
        pinataFormData.append('file', file);

        // Add Pinata metadata
        const pinataMetadata = {
            name: file.name,
            keyvalues: {
                etherith: 'true',
                userId: memoryMetadata.userId || 'anonymous',
                type: memoryMetadata.type || 'unknown',
                visibility: memoryMetadata.visibility || 'private',
                timestamp: Date.now().toString()
            }
        };

        pinataFormData.append('pinataMetadata', JSON.stringify(pinataMetadata));

        // Pinata options
        const pinataOptions = {
            cidVersion: 1,
            wrapWithDirectory: false
        };
        pinataFormData.append('pinataOptions', JSON.stringify(pinataOptions));

        // Upload to Pinata
        console.log('☁️ Uploading to Pinata IPFS...');
        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.PINATA_JWT}`,
            },
            body: pinataFormData
        });

        if (!pinataResponse.ok) {
            const errorText = await pinataResponse.text();
            throw new Error(`Pinata upload failed: ${pinataResponse.status} - ${errorText}`);
        }

        const pinataResult = await pinataResponse.json();
        console.log('✅ Pinata upload successful:', pinataResult.IpfsHash);

        // Generate proof of preservation
        const proof = {
            cid: pinataResult.IpfsHash,
            timestamp: new Date().toISOString(),
            pinned: true,
            pinService: 'Pinata',
            fileSize: file.size,
            fileName: file.name,
            pinataTimestamp: pinataResult.Timestamp,
            isDuplicate: pinataResult.isDuplicate || false,
            ipfsGateways: [
                `https://ipfs.io/ipfs/${pinataResult.IpfsHash}`,
                `https://gateway.pinata.cloud/ipfs/${pinataResult.IpfsHash}`,
                `https://cloudflare-ipfs.com/ipfs/${pinataResult.IpfsHash}`
            ]
        };

        // Return success response
        const response = {
            success: true,
            cid: pinataResult.IpfsHash,
            proof: proof,
            metadata: memoryMetadata,
            message: 'File successfully uploaded to IPFS and pinned'
        };

        console.log('🎯 IPFS upload complete');

        return new Response(JSON.stringify(response), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('❌ IPFS upload error:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Upload failed',
                details: 'Check server logs for more information'
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