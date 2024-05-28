import { useCustomUserContext } from "@/app/context/userStore";
import { Rule, TaskJson } from "@/types";
import { modifyTaskApi } from "@/utils/callKnownApi";
import { convertRuleToString } from "@/utils/convertRuleToString";
import React from "react";

export function AddRuleToTaskModal(props: {
  modal: React.RefObject<HTMLDialogElement>;
  task: TaskJson;
  rules: Rule[];
  reloadData: () => void;
}) {
  const { modal, rules, task, reloadData } = props;
  const {accessToken} = useCustomUserContext();
  const closeModal = () => modal.current?.close();

  return (
    <dialog
      ref={modal}
      className="w-4/5 h-4/5 bg-white border border-black rounded-2xl py-10 px-20"
    >
      <div className="h-full flex flex-col gap-10">
        <h2 className="text-5xl font-bold">
          add rule al gioco <em>{task.name}</em>
        </h2>
        <div className="overflow-scroll flex flex-col gap-2">
          {rules.map((r) => (
            <div
              key={`add-rule-${task.id}-${r.id}`}
              className="flex border border-collapse border-solid border-black text-2xl w-full px-7 duration-75 ease-in-out hover:bg-gray-200"
              onClick={() => {
                const new_task: TaskJson = JSON.parse(JSON.stringify(task));
                const new_rules = [...new_task.rules.map((rr) => rr.id), r.id!];
                // @ts-ignore
                new_task.rules = new_rules;
                modifyTaskApi(task, new_task, accessToken, reloadData);
                closeModal();
              }}
            >
              <p className="flex items-center px-7 mr-auto">
                {`${r.name}: ${convertRuleToString(r)}`}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-auto w-full flex justify-end">
          <button
            className="uppercase text-white py-3 px-7 text-2xl rounded-2xl duration-100 ease-in-out hover:scale-105"
            style={{
              backgroundColor: "#146AB9",
            }}
            onClick={() => closeModal()}
          >
            Chiudi
          </button>
        </div>
      </div>
    </dialog>
  );
}
