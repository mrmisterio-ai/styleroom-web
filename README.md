# StyleRoom - AI Virtual Try-On Frontend

AI 가상 피팅 서비스 프론트엔드 애플리케이션

## 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS
- Axios

## 개발 환경

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 배포

```bash
npm start
```

서버는 포트 5001에서 실행되며, `/api/*` 요청을 `localhost:5000`으로 프록시합니다.

## 기능

- 이미지 3장 업로드 (모델, 옷, 배경)
- 배경 텍스트 입력 또는 이미지 업로드
- AI 파라미터 조정 (Steps, Guidance Scale, Seed)
- 실시간 생성 상태 폴링
- 결과 이미지 다운로드
- 생성 히스토리 관리

## PM2 배포

```bash
pm2 start server.js --name styleroom-web
pm2 save
```
