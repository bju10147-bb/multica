"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, Loader2, Bot } from "lucide-react";
import { Button } from "@multica/ui/components/ui/button";
import { Card } from "@multica/ui/components/ui/card";
import { api } from "@multica/core/api";
import { useLocale } from "@multica/core";
import type { Agent, Issue, CreateIssueRequest } from "@multica/core/types";

interface OnboardingIssueDef {
  title: string;
  description: string;
  assignToAgent: boolean;
  status: "todo" | "backlog";
}

export function StepComplete({
  wsId,
  agent,
  onEnter,
}: {
  wsId: string;
  agent: Agent | null;
  onEnter: () => void;
}) {
  const { t } = useLocale();

  function getOnboardingIssues(): OnboardingIssueDef[] {
    return [
      {
        title: t.onboarding.onboardingIssues.hello.title,
        description: t.onboarding.onboardingIssues.hello.desc,
        assignToAgent: true,
        status: "todo",
      },
      {
        title: t.onboarding.onboardingIssues.repo.title,
        description: t.onboarding.onboardingIssues.repo.desc,
        assignToAgent: false,
        status: "backlog",
      },
      {
        title: t.onboarding.onboardingIssues.skill.title,
        description: t.onboarding.onboardingIssues.skill.desc,
        assignToAgent: false,
        status: "backlog",
      },
      {
        title: t.onboarding.onboardingIssues.team.title,
        description: t.onboarding.onboardingIssues.team.desc,
        assignToAgent: false,
        status: "backlog",
      },
    ];
  }

  const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const didCreate = useRef(false);

  useEffect(() => {
    if (didCreate.current) return;
    didCreate.current = true;

    async function createOnboardingIssues() {
      const defs = getOnboardingIssues();
      const issues: Issue[] = [];

      for (const def of defs) {
        try {
          const req: CreateIssueRequest = {
            title: def.title,
            description: def.description,
            status: def.status,
          };
          if (def.assignToAgent && agent) {
            req.assignee_type = "agent";
            req.assignee_id = agent.id;
          }
          const issue = await api.createIssue(req);
          issues.push(issue);
        } catch {
          // Best-effort — continue with remaining issues
        }
      }

      setCreatedIssues(issues);
      setLoading(false);
    }

    createOnboardingIssues();
  }, [agent, wsId]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      {/* Success icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <Check className="h-8 w-8 text-success" />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t.onboarding.allSet}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {agent
            ? t.onboarding.workspaceReadyWithAgent.replace("{name}", agent.name)
            : t.onboarding.workspaceReadyNoAgent}
        </p>
      </div>

      {/* Created issues */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t.onboarding.settingUpWorkspace}</span>
        </div>
      ) : (
        createdIssues.length > 0 && (
          <Card className="w-full divide-y">
            {createdIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {issue.identifier} {issue.title}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {issue.assignee_id && agent
                      ? t.onboarding.assignedToAgent.replace("{name}", agent.name)
                      : issue.status === "todo"
                        ? t.onboarding.todo
                        : t.onboarding.backlog}
                  </div>
                </div>
                {issue.assignee_id && agent && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <Bot className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                )}
              </div>
            ))}
          </Card>
        )
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={onEnter}
        disabled={loading}
      >
        {t.onboarding.goToWorkspace}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
