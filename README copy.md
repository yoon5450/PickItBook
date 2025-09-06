# React+Vite+Supabase+Prettier+ESLint 초기 설정 프로젝트

vite, supabase.js, prettier, eslint, react-icon 설치
kind-tiger 설치

@ : alias 설정

ESLINT 규칙 조정
```
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
```

### 설치된 dependency

```
    "@supabase/supabase-js": "^2.51.0",
    "@tailwindcss/vite": "^4.1.12",
    "chart.js": "^4.5.0",
    "clsx": "^2.1.1",
    "d3-ease": "^3.0.1",
    "kind-tiger": "^1.0.1",
    "react": "^19.1.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "react-router": "^7.8.1",
    "sweetalert2": "^11.22.4",
    "swiper": "^11.2.10",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.12",
    "zustand": "^5.0.8"
```

### .gitignore 세팅

### husky staged lint 적용