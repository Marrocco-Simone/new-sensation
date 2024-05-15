"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  SectionDescription,
  SectionTitle,
  Table,
  TableTitle,
  TdCell,
  ThCell,
} from "./utils";
import { Badge, BadgeJson } from "./types";
import { toBase64 } from "@/utils/toBase64";
import { Pen, Bin, PlusRound } from "../Icons";
import { createBadgeApi, deleteBadgeApi, modifyBadgeApi } from "@/utils/callKnownApi";
import { useCustomUserContext } from "@/app/context/userStore";

const badgeSubmit: (
  setBadgeModifying: (s: string) => void,
  setBadges: Dispatch<SetStateAction<Badge[]>>,
  badge_to_modify?: string,
  accessToken?: string,
) => React.FormEventHandler<HTMLFormElement> =
  (setBadgeModifying, setBadges, badge_to_modify, accessToken) => (event) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      name: HTMLInputElement;
      description: HTMLInputElement;
      classes: HTMLInputElement;
    };
    const name = target.name.value;
    const description = target.description.value;
    const classes = target.classes.value.split(",");

    const badge: BadgeJson = {name: name, description: description, classes: classes};

    if (!badge_to_modify) {
      createBadgeApi(badge, accessToken, (badge) => {
        setBadges(prev => [...prev, badge as Badge])
        setBadgeModifying("");
        // @ts-expect-error
        target.reset();
      })
    } else {
      modifyBadgeApi(badge_to_modify, badge, accessToken, (badge) => {
        setBadges(prev => prev.map(b => b._id == badge_to_modify ? badge : b))
        setBadgeModifying("");
        // @ts-expect-error
        target.reset();
      })
    }
  };

function BadgeRow({
  badge,
  setBadgeModifying,
  setBadges,
}: {
  badge: Badge;
  setBadgeModifying: (badge_name: string) => void;
  setBadges: Dispatch<SetStateAction<Badge[]>>,
}) {
  const {accessToken} = useCustomUserContext();
  
  return (
    <tr>
      <TdCell>{badge.name}</TdCell>
      <TdCell>{badge.description}</TdCell>
      <TdCell>{badge.classes.join(",")}</TdCell>
      <td>
        <div className="flex items-center">
          <div onClick={() => setBadgeModifying(badge._id)} className="h-10 aspect-square hover:scale-110">
            <Pen />
          </div>
          <div
            onClick={() => {
              deleteBadgeApi(badge._id, accessToken, () => setBadges(prev => prev.filter(b => b._id !== badge._id)))
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

function ModifyBadgeRow({
  badge,
  setBadgeModifying,
  setBadges
}: {
  badge?: Badge;
  setBadgeModifying: (badge_name: string) => void;
  setBadges: Dispatch<SetStateAction<Badge[]>>;
}) {
  const form_id = badge ? "modify-badge-form" : "new-badge-form";
  const {accessToken} = useCustomUserContext();

  return (
    <tr>
      <TdCell>
        <input
          type="text"
          defaultValue={badge?.name}
          placeholder="Inserisci il nome del badge."
          id="name"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <TdCell>
        <textarea
          defaultValue={badge?.description}
          placeholder="Inserisci una descrizione (es. Raccogli 8 ghiande...)"
          id="description"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <TdCell>
        <input
          type="text"
          defaultValue={badge?.name}
          placeholder="Inserisci il nome delle classi separate da virgola"
          id="classes"
          form={form_id}
          className="w-full"
          style={{ backgroundColor: "#E6F0F9" }}
          required
        />
      </TdCell>
      <td>
        <form
          id={form_id}
          onSubmit={badgeSubmit(setBadgeModifying, setBadges, badge?._id, accessToken)}
          className="m-2 flex items-center"
        >
          <button
            type="submit"
            className="h-10 aspect-square hover:scale-110"
          >
            <PlusRound />
          </button>
        </form>
      </td>
    </tr>
  );
}

export function Badges({ badges }: { badges: Badge[] }) {
  const [badge_modifying, setBadgeModifying] = useState("");
  const [currentBadges, setCurrentBadges] = useState<Badge[]>(badges);

  useEffect(() => {
    setCurrentBadges(badges)
  }, [badges])

  return (
    <section>
      <SectionTitle>Riconoscimenti</SectionTitle>
      <SectionDescription>
        Definisci i RICONOSCIMENTI presenti nella categoria {`"badge"`}.
      </SectionDescription>

      <TableTitle>Badge</TableTitle>
      <Table>
        <colgroup>
          <col span={1} className="w-3/12" />
          <col span={1} className="w-4/12" />
          <col span={1} className="w-3/12" />
          <col span={1} className="w-1/12" />
        </colgroup>
        <thead>
          <tr>
            <ThCell>Nome</ThCell>
            <ThCell>Descrizione</ThCell>
            <ThCell>Classi</ThCell>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentBadges.map((badge) => {
            if (badge._id === badge_modifying)
              return (
                <ModifyBadgeRow
                  badge={badge}
                  setBadgeModifying={setBadgeModifying}
                  setBadges={setCurrentBadges}
                />
              );

            return (
              <BadgeRow
                badge={badge}
                setBadgeModifying={setBadgeModifying}
                setBadges={setCurrentBadges}
                key={badge._id}
              />
            );
          })}
          <ModifyBadgeRow setBadgeModifying={setBadgeModifying} setBadges={setCurrentBadges} />
        </tbody>
      </Table>
    </section>
  );
}
