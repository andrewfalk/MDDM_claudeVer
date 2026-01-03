# MDDM 척추압박력 평가 시스템

Mainz-Dortmund Dose Model(MDDM) 기반 직업성 요추 질환 위험도 분석 시스템

## 🌟 주요 기능

- **척추 압박력 계산**: G1~G11 자세별 MDDM 공식 적용
- **누적 용량 분석**: 일일/평생 누적 용량 산출
- **기준 비교**: MDDM/독일법원/DWS2 3가지 기준
- **업무관련성 평가**: 산재 인정 가능성 자동 판정
- **AI 심층 분석**: Claude API 연동 전문가 분석
- **데이터 관리**: 저장/불러오기/Excel/PDF 내보내기
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

---

## 🚀 배포 가이드 (GitHub + Vercel)

### Step 1: GitHub 저장소 생성

1. [GitHub](https://github.com)에서 새 저장소 생성
   - Repository name: `mddm-spine-evaluation` (또는 원하는 이름)
   - Public 또는 Private 선택
   - "Add a README file" 체크 해제 (이미 있음)

2. 로컬에서 Git 초기화 및 푸시
   ```bash
   cd mddm-vercel
   git init
   git add .
   git commit -m "Initial commit: MDDM 척추압박력 평가 시스템 v1.3"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mddm-spine-evaluation.git
   git push -u origin main
   ```

### Step 2: Vercel 연결

1. [Vercel](https://vercel.com)에 로그인 (GitHub 계정으로 가입 권장)

2. **"Add New Project"** 클릭

3. **"Import Git Repository"** 에서 GitHub 저장소 선택
   - `mddm-spine-evaluation` 선택
   - "Import" 클릭

4. **Project Settings** 확인
   - Framework Preset: `Other`
   - Root Directory: `./` (기본값)
   - Build Command: 비워두기 또는 `echo 'No build'`
   - Output Directory: `public`

5. **"Deploy"** 클릭

### Step 3: 환경 변수 설정 ⚠️ 중요!

1. Vercel 대시보드 → 프로젝트 선택 → **Settings** → **Environment Variables**

2. 환경 변수 추가:
   | Name | Value | Environment |
   |------|-------|-------------|
   | `CLAUDE_API_KEY` | `sk-ant-api03-xxxxx...` | Production, Preview, Development 모두 체크 |

3. **"Save"** 클릭

4. **재배포** 필요: Deployments → 최신 배포 → 우측 ⋮ 메뉴 → **"Redeploy"**

### Step 4: 배포 확인

- 배포 URL 확인: `https://mddm-spine-evaluation-xxx.vercel.app`
- AI 분석 기능 테스트

---

## 📁 프로젝트 구조

```
mddm-vercel/
├── public/
│   ├── index.html          # 메인 애플리케이션
│   └── images/
│       ├── G1_From.png     # 자세 이미지 (G1~G11)
│       └── ...
├── api/
│   └── analyze.js          # Claude API 프록시 (서버리스)
├── package.json
├── vercel.json             # Vercel 배포 설정
├── .gitignore
└── README.md
```

---

## 🔒 보안

- **API 키**: 서버 측 환경 변수로 관리 (클라이언트 노출 없음)
- **프록시 패턴**: 클라이언트 → Vercel API Route → Claude API
- **요청 검증**: 프롬프트 길이 제한 (50,000자)

---

## 🛠️ 로컬 개발

```bash
# Vercel CLI 설치
npm i -g vercel

# 환경 변수 설정 (.env.local 파일 생성)
echo "CLAUDE_API_KEY=sk-ant-api03-xxxxx" > .env.local

# 개발 서버 실행
vercel dev

# 브라우저에서 http://localhost:3000 접속
```

---

## 📝 업데이트 방법

1. 로컬에서 코드 수정
2. Git 커밋 & 푸시
   ```bash
   git add .
   git commit -m "Update: 변경 내용"
   git push
   ```
3. Vercel이 자동으로 재배포 (GitHub 연동 시)

---

## 🔧 커스터마이징

### AI 모델 변경

`api/analyze.js`에서 기본 모델 변경:
```javascript
model: model || 'claude-sonnet-4-20250514',  // 여기 수정
```

**사용 가능한 모델**:
- `claude-sonnet-4-20250514` (권장, 균형)
- `claude-3-5-haiku-20241022` (빠름, 저렴)

### Rate Limiting 추가 (선택)

Upstash Redis를 사용한 요청 제한:
```bash
npm install @upstash/ratelimit @upstash/redis
```

---

## 📄 라이선스

MIT License

---

## 🙏 크레딧

- **MDDM 모델**: Mainz-Dortmund Dose Model (독일)
- **AI 분석**: Anthropic Claude API
- **호스팅**: Vercel
