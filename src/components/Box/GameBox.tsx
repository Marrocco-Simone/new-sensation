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
import GamificationMode from "./GamificationMode";

export function GameBox(props: {
  task: TaskJson;
  rules: Rule[];
  vocabularies_metadata: VocabularyMetadata[];
  reloadData: () => void;
}) {
  const { task, rules, vocabularies_metadata, reloadData } = props;
  const task_instances_url = `tasks/${task.id}/instances`;
  const [smarterId, setSmarterId] = useState("");
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

  // TODO: refactor this only for demo purposes
  const taskConfig = useMemo(() => {
    const conf: { [x: string]: any } = {};
    for (const v of vocabularies_metadata) {
      conf[v.name] = {
        SmarterStateReader: {
          broker: "ssl://ib05a168.ala.us-east-1.emqxsl.com:8883",
          user: "smarter",
          password: "melaC-melaV",
          smarter: "smarter_fbk_" + smarterId,
        },
      };
    }

    return conf;
  }, [smarterId, vocabularies_metadata]);

  function createNewInstance() {
    wrapApiCallInWaitingSwal(
      () => apiPost(task_instances_url, taskConfig, accessToken),
      () => {
        Swal.fire("Gioco attivato", "", "success");
        resetInstances();
      }
    );
  }

  function deleteInstances() {
    if (!instances) return;

    const promises = instances.map((i) =>
      apiDelete(task_instances_url + `/${i.instanceId}`, accessToken)
    );

    Promise.all(promises).then(() => {
      Swal.fire("Gioco eliminato", "", "success");
      resetInstances();
    });
  }

  return (
    <div className="border border-solid border-black rounded-xl mb-5">
      <GameBoxTopRow task={task} reloadData={reloadData} />

      <div className="flex justify-between text-2xl p-7">
        <Toggle
          checked={!!instances && instances.length > 0}
          disabled={!instances}
          label_text="attivato / disattivato"
          checkedFn={() =>
            waitForConfirmSwal(
              `Vuoi chiudere le istanze del gioco ${task.name}?`,
              "Chiudi",
              () => deleteInstances()
            )
          }
          uncheckedFn={() =>
            waitForConfirmSwal(
              `Vuoi creare una nuova istanza del gioco ${task.name}?`,
              "Apri",
              () => createNewInstance()
            )
          }
        />
        <div className="flex items-center gap-2">
          <div>Inserisci ID smarter</div>
          <select
            defaultValue={1}
            className="border border-black border-2 rounded-md p-2"
            value={smarterId}
            onChange={(e) => setSmarterId(e.currentTarget.value)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select>
        </div>
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
          Aggiungi Regola
        </button>
      </div>

      <AddRuleToTaskModal
        modal={modal}
        task={task}
        rules={rules}
        reloadData={reloadData}
      />

      <GamificationMode />
    </div>
  );
}
