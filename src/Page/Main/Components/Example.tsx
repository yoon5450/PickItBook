// TechStackPage.tsx - 간단한 WordCloud 사용 예시
import React from "react";
import WordCloud, { type WordData } from "./WordCloud";

const TechStackPage: React.FC = () => {
  // 기술 스택 데이터
  const techStackData: WordData[] = [
    { text: "React", value: 100 },
    { text: "TypeScript", value: 95 },
    { text: "JavaScript", value: 90 },
    { text: "TailwindCSS", value: 85 },
    { text: "Node.js", value: 80 },
    { text: "Next.js", value: 75 },
    { text: "CSS", value: 70 },
    { text: "HTML", value: 65 },
    { text: "Vue.js", value: 60 },
    { text: "Angular", value: 55 },
    { text: "Svelte", value: 50 },
    { text: "GraphQL", value: 45 },
    { text: "REST API", value: 40 },
    { text: "MongoDB", value: 35 },
    { text: "PostgreSQL", value: 30 },
    { text: "Docker", value: 25 },
    { text: "AWS", value: 20 },
    { text: "Vercel", value: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          기술 스택
        </h1>

        {/* WordCloud */}
        <div className="flex justify-center">
          <WordCloud
            words={techStackData}
            width={800}
            height={500}
            minFontSize={16}
            maxFontSize={52}
            className="border border-gray-200 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default TechStackPage;
