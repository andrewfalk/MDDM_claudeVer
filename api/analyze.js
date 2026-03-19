// MDDM 척추압박력 평가 시스템 - AI 분석 API Route
// Claude API 프록시 (API 키를 서버에서 안전하게 관리)

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: { message: 'Method not allowed. Use POST.' } 
        });
    }

    // 환경 변수에서 API 키 읽기
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
        console.error('CLAUDE_API_KEY environment variable is not set');
        return res.status(500).json({ 
            error: { message: 'AI 분석 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.' } 
        });
    }

    try {
        const { prompt, model } = req.body;

        // 요청 검증
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ 
                error: { message: '분석할 데이터가 없습니다.' } 
            });
        }

        // 프롬프트 길이 제한 (비용 관리)
        if (prompt.length > 50000) {
            return res.status(400).json({ 
                error: { message: '요청 데이터가 너무 큽니다.' } 
            });
        }

        // Claude API 호출
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-beta': 'prompt-caching-2024-07-31'
            },
            body: JSON.stringify({
                model: model || 'claude-haiku-4-5-20251001',
                max_tokens: 2000,
                system: [
                    {
                        type: 'text',
                        text: `당신은 MDDM(Mainz-Dortmund Dose Model) 전문가이며 직업성 요추 질환 평가에 특화된 산업의학 전문의입니다.
다음 지침에 따라 분석하세요:
1. MDDM 공식(F = b + m·L)과 G1~G11 자세 분류 기준을 정확히 적용
2. 한국 산재보상보험법 기준(법원 기준: 남 12.5 MN·h, 여 8.5 MN·h) 참조
3. DWS2 기준(남 7.0 MN·h, 여 3.0 MN·h)을 업무관련성 판단의 주요 기준으로 사용
4. 분석 결과는 한국어로 작성하고, 전문 용어는 명확히 설명
5. 구체적이고 실행 가능한 개선 권고를 우선순위와 함께 제시`,
                        cache_control: { type: 'ephemeral' }
                    }
                ],
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        // API 오류 처리
        if (!response.ok) {
            console.error('Claude API error:', data);
            
            // 사용자 친화적 오류 메시지
            let userMessage = 'AI 분석 중 오류가 발생했습니다.';
            
            if (response.status === 401) {
                userMessage = 'API 인증 오류입니다. 관리자에게 문의하세요.';
            } else if (response.status === 429) {
                userMessage = '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            } else if (response.status === 500) {
                userMessage = 'AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.';
            }
            
            return res.status(response.status).json({ 
                error: { message: userMessage, detail: data.error?.message } 
            });
        }

        // 성공 응답
        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: { message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' } 
        });
    }
}
