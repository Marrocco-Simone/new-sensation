import Toggle from "@/components/Toggle";
import { apiDelete, apiGet, apiPost } from "@/services/api";
import Bin from "@/svg/Bin";
import { Rule, TaskInfo, TaskJson, VocabularyMetadata } from "@/types";
import wrapApiCallInWaitingSwal from "@/utils/wrapApiCallInWaitingSwal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import RuleBox from "./RuleBox";
import Copy from "@/svg/Copy";
import { createTaskApi, deleteTaskApi } from "@/utils/callKnownApi";
import AddRuleToTaskModal from "./AddRuleToTaskModal";
import waitForConfirmSwal from "@/utils/waitForConfirmSwal";

export default function GameBox(props: {
  task: TaskJson;
  rules: Rule[];
  vocabularies_metadata: VocabularyMetadata[];
  reloadData: () => void;
}) {
  const { task, rules, vocabularies_metadata, reloadData } = props;
  const task_instances_url = `tasks/${task.id}/instances`;
  const modal = useRef<HTMLDialogElement>(null);

  // * only running instances
  const [instances, setInstances] = useState<TaskInfo[]>();
  const resetInstances = () =>
    apiGet<TaskInfo[]>(task_instances_url).then((res) => {
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
          broker: "tcp://localhost:1883",
          user: "admin",
          password: "password",
          smarter: "smarter_fbk_5",
        },
      };
    }

    return conf;
  }, [vocabularies_metadata]);

  function createNewInstance() {
    wrapApiCallInWaitingSwal(
      () => apiPost(task_instances_url, taskConfig),
      () => {
        Swal.fire("Gioco attivato", "", "success");
        resetInstances();
      }
    );
  }

  function deleteInstances() {
    if (!instances) return;

    const promises = instances.map((i) =>
      apiDelete(task_instances_url + `/${i.instanceId}`)
    );

    Promise.all(promises).then(() => {
      Swal.fire("Gioco eliminato", "", "success");
      resetInstances();
    });
  }

  return (
    <div className="border border-solid border-black rounded">
      <div className="flex h-12 items-center justify-start p-7 pt-12">
        <h2 className="w-4/5 mr-auto text-3xl font-bold">{task.name}</h2>
        <div
          className="ml-auto h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
          onClick={() =>
            createTaskApi(
              task.name + " - copia",
              task.rules.map((r) => r.id),
              reloadData
            )
          }
        >
          <Copy />
        </div>
        <div
          className="h-20 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
          onClick={() => deleteTaskApi(task, reloadData)}
        >
          <Bin />
        </div>
      </div>

      <div className="text-2xl p-7">
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
        // rules={[...rules, ...rules, ...rules, ...rules, ...rules]}
        rules={rules}
        reloadData={reloadData}
      />
    </div>
  );
}
