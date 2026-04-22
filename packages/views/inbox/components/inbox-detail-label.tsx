"use client";

import { STATUS_CONFIG, PRIORITY_CONFIG } from "@multica/core/issues/config";
import { useActorName } from "@multica/core/workspace/hooks";
import { StatusIcon, PriorityIcon } from "../../issues/components";
import type { InboxItem, InboxItemType, IssueStatus, IssuePriority } from "@multica/core/types";
import { useLocale } from "@multica/core";

export function useInboxI18n() {
  const { t } = useLocale();
  return {
    typeLabels: t.inbox.types as Record<InboxItemType, string>,
    t,
  };
}

function shortDate(dateStr: string, locale: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export function InboxDetailLabel({ item }: { item: InboxItem }) {
  const { getActorName } = useActorName();
  const { typeLabels, t } = useInboxI18n();
  const details = item.details ?? {};

  switch (item.type) {
    case "status_changed": {
      if (!details.to) return <span>{typeLabels[item.type]}</span>;
      return (
        <span className="inline-flex items-center gap-1">
          {t.inbox.details.setStatusTo}
          <StatusIcon status={details.to as IssueStatus} className="h-3 w-3" />
          {t.issues.status[details.to as IssueStatus]}
        </span>
      );
    }
    case "priority_changed": {
      if (!details.to) return <span>{typeLabels[item.type]}</span>;
      return (
        <span className="inline-flex items-center gap-1">
          {t.inbox.details.setPriorityTo}
          <PriorityIcon priority={details.to as IssuePriority} className="h-3 w-3" />
          {t.issues.priority[details.to as IssuePriority]}
        </span>
      );
    }
    case "issue_assigned": {
      if (details.new_assignee_id) {
        return <span>{t.inbox.details.assignedTo.replace("{to}", getActorName(details.new_assignee_type ?? "member", details.new_assignee_id))}</span>;
      }
      return <span>{typeLabels[item.type]}</span>;
    }
    case "unassigned":
      return <span>{t.inbox.details.removedAssignee}</span>;
    case "assignee_changed": {
      if (details.new_assignee_id) {
        return <span>{t.inbox.details.assignedTo.replace("{to}", getActorName(details.new_assignee_type ?? "member", details.new_assignee_id))}</span>;
      }
      return <span>{typeLabels[item.type]}</span>;
    }
    case "due_date_changed": {
      if (details.to) return <span>{t.inbox.details.setDueDateTo.replace("{to}", shortDate(details.to, t.locale || "en"))}</span>;
      return <span>{t.inbox.details.removedDueDate}</span>;
    }
    case "new_comment": {
      if (item.body) return <span>{item.body}</span>;
      return <span>{typeLabels[item.type]}</span>;
    }
    case "reaction_added": {
      const emoji = details.emoji;
      if (emoji) return <span>{t.inbox.details.reactedToComment.replace("{emoji}", emoji)}</span>;
      return <span>{typeLabels[item.type]}</span>;
    }
    default:
      return <span>{typeLabels[item.type] ?? item.type}</span>;
  }
}
