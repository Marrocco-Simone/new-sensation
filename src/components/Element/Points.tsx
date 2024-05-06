"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Point } from "./types";
import {
  SectionDescription,
  SectionTitle,
  Table,
  TableTitle,
  TdCell,
  ThCell,
} from "./utils";
import { Bin, Pen, PlusRound } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";
import { createPointApi, deletePointApi, modifyPointApi } from "@/utils/callKnownApi";

const pointSubmit: (
  setPointModifying: (s: string) => void,
  setPoints: Dispatch<SetStateAction<Point[]>>,
  point_to_modify?: string,
  accessToken?: string
) => React.FormEventHandler<HTMLFormElement> =
  (setPointModifying, setPoints, point_to_modify, accessToken) => (event) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      name: HTMLInputElement;
      quantity: HTMLInputElement;
    };
    const name = target.name.value;
    const quantity = +target.quantity.value;

    if (!point_to_modify) {
      createPointApi({name, quantity}, accessToken, (point) => {
        setPoints(prev => [...prev, point])
        setPointModifying("");
        // @ts-expect-error
        target.reset();
      })
    } else {
      modifyPointApi(point_to_modify, {name, quantity}, accessToken, (point) => {
        setPoints(prev => prev.map(l => l._id == point_to_modify ? point : l))
        setPointModifying("");
        // @ts-expect-error
        target.reset();
      })
    }
  };

function PointRow({
  point,
  setPointModifying,
  setPoints
}: {
  point: Point;
  setPointModifying: (point_name: string) => void;
  setPoints: Dispatch<SetStateAction<Point[]>>,
}) {
  const {accessToken} = useCustomUserContext();
  return (
    <tr>
      <TdCell>{point.name}</TdCell>
      <TdCell>{point.quantity}</TdCell>
      <td>
        <div className="flex items-center">
          <div onClick={() => setPointModifying(point._id)} className="h-10 aspect-square hover:scale-110">
            <Pen />
          </div>
          <div
            onClick={() => {
              deletePointApi(point._id, accessToken, () => setPoints(prev => prev.filter(l => l._id !== point._id)))
            }}
            className="h-10 aspect-square hover:scale-110"
          >
            <Bin />
          </div>
        </div>
      </td>
    </tr>
  );
}

function ModifyPointRow({
  point,
  setPointModifying,
  setPoints
}: {
  point?: Point;
  setPointModifying: (point_name: string) => void;
  setPoints: Dispatch<SetStateAction<Point[]>>,
}) {
  const form_id = point ? "modify-point-form" : "new-point-form";
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>
        <input
          type="text"
          defaultValue={point?.name}
          placeholder="Per cosa viene assegnato? (es Esercizi livello 1...)"
          id="name"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <TdCell>
        <input
          type="number"
          defaultValue={point?.quantity}
          placeholder="Quanti punti vengono assegnati?"
          id="quantity"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          min={0}
          required
        />
      </TdCell>
      <td>
        <form
          id={form_id}
          onSubmit={pointSubmit(setPointModifying, setPoints, point?._id, accessToken)}
          className="m-2 flex items-center"
        >
          <button type="submit" className="h-10 aspect-square hover:scale-110">
            <PlusRound />
          </button>
        </form>
      </td>
    </tr>
  );
}

export function Points({ points }: { points: Point[] }) {
  const [point_modifying, setPointModifying] = useState("");
  const [currentPoints, setCurrentPoints] = useState<Point[]>(points ?? []);

  useEffect(() => {
    setCurrentPoints(points)
  }, [points])

  return (
    <section>
      <SectionTitle>Punti</SectionTitle>
      <SectionDescription>
        Definisci i PUNTI da assegnare allo studente nella categoria{" "}
        {`"punti esperienza"`}.
      </SectionDescription>

      <TableTitle>Punti esperienza (ghiande)</TableTitle>
      <Table>
        <colgroup>
          <col span={1} className="w-4/12" />
          <col span={1} className="w-7/12" />
          <col span={1} className="w-1/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>Nome</ThCell>
            <ThCell>Quantità</ThCell>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentPoints.map((point) => {
            if (point._id === point_modifying)
              return (
                <ModifyPointRow
                  setPointModifying={setPointModifying}
                  setPoints={setCurrentPoints}
                  point={point}
                />
              );

            return (
              <PointRow
                point={point}
                setPointModifying={setPointModifying}
                setPoints={setCurrentPoints}
                key={point.name}
              />
            );
          })}
          <ModifyPointRow setPointModifying={setPointModifying} setPoints={setCurrentPoints}/>
        </tbody>
      </Table>
    </section>
  );
}
