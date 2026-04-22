import type { Metadata } from "next";
import { MulticaLanding } from "@/features/landing/components/multica-landing";

export const metadata: Metadata = {
  title: "홈페이지",
  description:
    "Multica — 코딩 에이전트를 진짜 팀원처럼 다루는 오픈소스 플랫폼입니다. 작업을 할당하고, 진행 상황을 추적하고, 지식을 축적하세요.",
  openGraph: {
    title: "Multica — 사람 + 에이전트 팀을 위한 프로젝트 관리",
    description:
      "사람과 에이전트 팀을 한곳에서 운영하세요.",
    url: "/homepage",
  },
  alternates: {
    canonical: "/homepage",
  },
};

export default function HomepagePage() {
  return <MulticaLanding />;
}
