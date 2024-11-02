import Toggle from "@/components/Toggle";
import { apiDelete, apiGet, apiPost } from "@/services/api";
import { Rule, TaskInfo, TaskJson, VocabularyMetadata } from "@/types";
import wrapApiCallInWaitingSwal from "@/utils/wrapApiCallInWaitingSwal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import waitForConfirmSwal from "@/utils/waitForConfirmSwal";
import { AddRuleToTaskModal } from "../Modal";
import { GameBoxTopRow, RuleBox } from ".";
import { useCustomUserContext } from "@/app/context/userStore";
import { Game } from "../Element/types";

export function GameBox(props: {
  task: TaskJson;
  rules: Rule[];
  vocabularies_metadata: VocabularyMetadata[];
  game?: Game
  reloadData: () => void;
}) {
  const { task, rules, vocabularies_metadata, game, reloadData } = props;
  const task_instances_url = `tasks/${task.id}/instances`;
  const modal = useRef<HTMLDialogElement>(null);
  const { accessToken } = useCustomUserContext();

  // * only running instances
  const [instances, setInstances] = useState<TaskInfo[]>();
  const resetInstances = () =>
    apiGet<TaskInfo[]>(task_instances_url, accessToken).then((res) => {
      if (res.status === "success")
        setInstances(res.data?.filter((x) => x.status === "RUNNING"));
    });

  useEffect(() => {
    resetInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function deleteInstances() {
    if (!instances) return;

    const promises = instances.map((i) =>
      apiDelete(task_instances_url + `/${i.instanceId}`, accessToken)
    );

    Promise.all(promises).then(() => {
      Swal.fire("Game stopped", "", "success");
      resetInstances();
    });
  }

  return (
    <div className="border border-solid border-black rounded-xl mb-5">
      <GameBoxTopRow task={task} game={game} reloadData={reloadData} />

      <div className="flex justify-between text-2xl p-7">
        <Toggle
          checked={!!instances && instances.length > 0}
          disabled={!instances}
          label_text="attivato / disattivato"
          checkedFn={() =>
            waitForConfirmSwal(
              `Are you sure about closing the game ${task.name}?`,
              "Chiudi",
              () => deleteInstances()
            )
          }
          uncheckedFn={() => {}}
        />
      </div>

      {task.rules.map((r) => (
        <RuleBox
          key={r.id}
          task={task}
          rule={r}
          vocabularies_metadata={vocabularies_metadata}
          reloadData={reloadData}
        />
      ))}

      <div className="flex justify-end p-7 w-full border-t-2 border-solid border-black">
        <button
          className="uppercase text-white py-3 px-7 text-2xl rounded-2xl duration-100 ease-in-out hover:scale-105"
          style={{
            backgroundColor: "#146AB9",
          }}
          onClick={() => {
            if (modal.current) modal.current?.showModal();
          }}
        >
          Add rule
        </button>
      </div>

      <AddRuleToTaskModal
        modal={modal}
        task={task}
        rules={rules}
        reloadData={reloadData}
      />
    </div>
  );
}
