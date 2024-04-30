import {
  Block,
  CreateTaskJson,
  Rule,
  RuleJson,
  TaskJson,
  VocabularyMetadata,
} from "@/types";
import { convertRuleToRuleJson } from "./fromApitoAppTypes";
import Swal from "sweetalert2";
import wrapApiCallInWaitingSwal from "./wrapApiCallInWaitingSwal";
import { apiDelete, apiPost, apiPut } from "@/services/api";
import waitForConfirmSwal from "./waitForConfirmSwal";
import { Badge, BadgeJson, ExerciseLevel, ExperienceLevel, ExperienceLevelJson } from "@/components/Element/types";

export function createRuleApi(
  rule: Rule,
  blocks: Block[],
  vocabularies_metadata: VocabularyMetadata[],
  access_token?: string,
  reloadData?: () => void
) {
  const rule_json_res = convertRuleToRuleJson(
    rule,
    blocks,
    vocabularies_metadata
  );

  if (rule_json_res.status !== "success")
    return Swal.fire("Errore", rule_json_res.msg, "error");

  const rule_json = rule_json_res.rule;
  wrapApiCallInWaitingSwal(
    () => apiPost<RuleJson>("rules", rule_json, access_token),
    (res) => {
      Swal.fire("Regola creata", res.data?.name, "success");
      if (reloadData) reloadData();
    }
  );
}

export function modifyRuleApi(
  rule: Rule,
  blocks: Block[],
  vocabularies_metadata: VocabularyMetadata[],
  access_token?: string,
  reloadData?: () => void
) {
  if (!rule.id) return Swal.fire("Errore, rule non ha id");

  const rule_json_res = convertRuleToRuleJson(
    rule,
    blocks,
    vocabularies_metadata
  );

  if (rule_json_res.status !== "success")
    return Swal.fire("Errore", rule_json_res.msg, "error");

  const rule_json = rule_json_res.rule;
  wrapApiCallInWaitingSwal(
    () => apiPut<RuleJson>(`rules/${rule.id}`, rule_json, access_token),
    (res) => {
      Swal.fire("Regola modificata", res.data?.name, "success");
      if (reloadData) reloadData();
    }
  );
}

export function deleteRuleApi(rule: Rule, access_token?: string, reloadData?: () => void) {
  if (!rule.id) return Swal.fire("Errore", "Rule does not have id", "error");

  waitForConfirmSwal(`Vuoi eliminare la regola?`, "Elimina", () =>
    wrapApiCallInWaitingSwal(
      () => apiDelete<RuleJson>(`rules/${rule.id}`, access_token),
      () => {
        Swal.fire("Regola eliminata", "", "success");
        if (reloadData) reloadData();
      }
    )
  );
}

export function createTaskApi(
  name: string,
  rules_id: string[],
  access_token?: string,
  reloadData?: () => void,
  onSuccessCallback?: () => void
) {
  const new_task: CreateTaskJson = {
    name,
    rules: rules_id,
  };

  wrapApiCallInWaitingSwal(
    () => apiPost<TaskJson>("tasks", new_task, access_token),
    (res) => {
      if (!onSuccessCallback) {
        Swal.fire("Gioco creato", res.data?.name, "success");
      }

      onSuccessCallback?.();
      
      if (reloadData) reloadData();
    }
  );
}

export function modifyTaskApi(
  task: TaskJson,
  new_task: TaskJson,
  access_token?: string,
  reloadData?: () => void
) {
  if (!task?.id) return Swal.fire("Errore", "Task does not have id", "error");

  wrapApiCallInWaitingSwal(
    () => apiPut<TaskJson>(`tasks/${task.id}`, new_task, access_token),
    (res) => {
      Swal.fire("Gioco modificato", res.data?.name, "success");
      if (reloadData) reloadData();
    }
  );
}

export function deleteTaskApi(task: TaskJson, access_token?: string, reloadData?: () => void) {
  if (!task?.id) return Swal.fire("Errore", "Task does not have id", "error");

  waitForConfirmSwal(`Vuoi eliminare il gioco ${task.name}?`, "Elimina", () =>
    wrapApiCallInWaitingSwal(
      () => apiDelete(`tasks/${task.id}`, access_token),
      (res) => {
        Swal.fire("Gioco eliminato", "", "success");
        if (reloadData) reloadData();
      }
    )
  );
}

export function createBadgeApi(
  badge: BadgeJson,
  access_token?: string,
  reloadData?: (badge: Badge) => void
) {
  wrapApiCallInWaitingSwal(
    () => apiPost<Badge>("http://localhost:5001/badge/add", badge, access_token),
    (res) => {
      Swal.fire("Badge creato", res.data?.name, "success");
      if (reloadData && res.data) reloadData(res.data);
    }
  );
}

export function modifyBadgeApi(
  badge_id: string,
  badge: BadgeJson,
  access_token?: string,
  reloadData?: (badge: Badge) => void
) {
  wrapApiCallInWaitingSwal(
    () => apiPut<Badge>("http://localhost:5001/badge/"+badge_id, badge, access_token),
    (res) => {
      Swal.fire("Badge modificato", res.data?.name, "success");
      if (reloadData && res.data) reloadData(res.data);
    }
  );
}

export function deleteBadgeApi(
  badge_id: string,
  access_token?: string,
  reloadData?: () => void
) {
  wrapApiCallInWaitingSwal(
    () => apiDelete<null>("http://localhost:5001/badge/"+badge_id, access_token),
    (res) => {
      Swal.fire("Badge cancellato", "success");
      if (reloadData) reloadData();
    }
  );
}

export function createExpLevelApi(
  exp_lvl: ExperienceLevelJson,
  access_token?: string,
  reloadData?: (expLvl: ExperienceLevel) => void
) {
  wrapApiCallInWaitingSwal(
    () => apiPost<ExperienceLevel>("http://localhost:5001/levels",exp_lvl, access_token),
    (res) => {
      Swal.fire("Livello esperienza "+ res.data?.name +" aggiunto", "success");
      if (reloadData && res.data) reloadData(res.data);
    }
  );
}

export function modifyExpLevelApi(
  exp_lvl_id: string,
  exp_lvl: ExperienceLevelJson,
  access_token?: string,
  reloadData?: (expLvl: ExperienceLevel) => void
) {
  wrapApiCallInWaitingSwal(
    () => apiPut<ExperienceLevel>("http://localhost:5001/levels/"+exp_lvl_id ,exp_lvl, access_token),
    (res) => {
      Swal.fire("Livello esperienza "+ res.data?.name +" aggiunto", "success");
      if (reloadData && res.data) reloadData(res.data);
    }
  );
}

export function deleteExpLvlApi(
  exp_lvl_id: string,
  access_token?: string,
  reloadData?: () => void
) {
  wrapApiCallInWaitingSwal(
    () => apiDelete<null>("http://localhost:5001/levels/"+exp_lvl_id, access_token),
    (res) => {
      Swal.fire("Livello esperienza cancellato", "success");
      if (reloadData) reloadData();
    }
  );
}

export function createExerciseLevelApi(
  game_id: string,
  exc_lvl: ExerciseLevel,
  access_token?: string,
  reloadData?: (expLvl: ExperienceLevel) => void
) {
  wrapApiCallInWaitingSwal(
    () => apiPost<ExperienceLevel>("http://localhost:5001/games/"+game_id+"/levels", exc_lvl, access_token),
    (res) => {
      Swal.fire("Livello esercizio "+ res.data?.name +" aggiunto", "success");
      if (reloadData && res.data) reloadData(res.data);
    }
  );
}

export function deleteExecLvlApi(
  game_id: string,
  exp_lvl_id: string,
  access_token?: string,
  reloadData?: () => void
) {
  wrapApiCallInWaitingSwal(
    () => apiDelete<null>("http://localhost:5001/games/"+game_id+"/levels/"+exp_lvl_id, access_token),
    (res) => {
      Swal.fire("Livello esperienza cancellato", "success");
      if (reloadData) reloadData();
    }
  );
}
