'use client'

import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { linksPermissions } from "@/utils/links";
import { useCustomUserContext } from "../context/userStore";
import { Bin, Copy, DocumentPlus, Pen } from "@/components/Icons";
import { useVocabularyApiQuery } from "@/hooks/useKnownApiQuery";
import { VocabularyMetadata } from "@/types";
import { apiDelete, apiPost, apiPut } from "@/services/api";
import { NoElementMenu } from "@/components/Menu";

type VocabolaryCardProps = {
  id: string;
  name: string;
  currentVersion: string;
  versions: string[];
  onUpload: (file: File) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onVersionUpdate: (version: string) => Promise<boolean> | boolean;
}

function VocabularyCard(props: VocabolaryCardProps) {
  const {
    id,
    name, 
    currentVersion, 
    versions, 
    onUpload,
    onDelete,
    onVersionUpdate
  } = props;

  const [version, setVersion] = useState(currentVersion);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: any) => {
    if (!event.target) return;

    onUpload(event.target.files[0]);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  useEffect(() => {
    setVersion(currentVersion);
  }, [currentVersion])
  
  return (
    //<div className="max-w-md shadow-md rounded-md overflow-hidden border-2 border-black">
    <div className="grid grid-cols-5 gap-4 lg:max-w-[70%] md:max-w-[75%] border-2 border-black p-2 rounded-md items-center">
      <div className="col-span-2 font-semibold lg:text-2xl md:text-lg text-sm">Name</div>
      <div className="col-span-2 font-semibold lg:text-2xl md:text-lg text-sm">Versione</div>
      <div className="col-span-1 font-semibold lg:text-2xl md:text-lg text-sm">Operazioni</div>
      <div className="col-span-2 md:text-2xl sm:text-xl font-semibold">{name}</div>
      <select
        onChange={async (event) => {
          const newVersion = event.currentTarget.value;
          const check = await onVersionUpdate(newVersion);
          if (check) {
            setVersion(newVersion);
          }
        }}
        value={version}
        className="col-span-2 bg-white-50 border-2 border-gray-800 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block p-1"
      >
        {versions.map((value,key) => (
          <option key={key}>{value}</option>
        ))}
        
      </select>
      <div className="col-span-1 flex w-[75%]">
      <input
        type="file"
        name="file"
        onChange={handleFileChange}
        ref={fileRef}
        hidden
      />
        <div
          onClick={() => fileRef?.current?.click()}
          className="cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Pen />
        </div>
        <div
          onClick={() => {
            onDelete(id);
          }}
          className="cursor-pointer duration-75 ease-in-out hover:scale-110"
        >
          <Bin />
        </div>
      </div>
    </div>
  )
}

export default function Start() {
  const { accessToken } = useCustomUserContext();

  const { data, is_loading, is_error } = useVocabularyApiQuery();
  const [vocabulariesMetadata, setVocabulariesMetadata] = useState<VocabularyMetadata[] | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (is_loading) return;
    if (is_error) return;
    
    setVocabulariesMetadata(data.vocabularies_metadata);
  }, [data?.vocabularies_metadata, is_error, is_loading]);

  

  

  const onUpload = (vocabulary: VocabularyMetadata) => async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const resp = await apiPut<VocabularyMetadata>("vocabularies/" + vocabulary.id, formData, accessToken, {});

    if (resp.status === "error") {
      console.log(resp.message);
      return;
    }
    const vm = resp.data!!;

    setVocabulariesMetadata((prev) => {
      if (!prev) return null;
      const index = prev?.findIndex(v => v.id === vm.id);
      prev[index] = vm;

      return [...prev];
    })
  }

  const onVersionUpdate = (vocabulary: VocabularyMetadata) => 
    async (version: string) => {
      const resp = await apiPost<VocabularyMetadata>("vocabularies/" + vocabulary.id + "/setVersion", {version: version}, accessToken);

      if (resp.status === "error") {
        console.log(resp.message);
        return false;
      }

      setVocabulariesMetadata((prev) => {
        if (!prev) return null;
        const index = prev?.findIndex(v => v.id === vocabulary.id);
        prev[index].currentJarVersion = version;

        return [...prev];
      })

      return true;
    }

  const onDelete = async (id: string) => {
      const resp = await apiDelete<VocabularyMetadata>("vocabularies/" + id, accessToken);

      if (resp.status === "error") {
        console.log(resp.message);
        return;
      }

      setVocabulariesMetadata((prev) => {
        if (!prev) return null;

        return prev.filter(v => v.id !== id);
      })
    }

  const handleFileChange = async (event: any) => {
    if (!event.target) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    const resp = await apiPost<VocabularyMetadata>("vocabularies", formData, accessToken, {});

    if (resp.status === "error") {
      console.log(resp.message);
      return;
    }
    const vm = resp.data!!;

    setVocabulariesMetadata((prev) => {
      if (!prev) prev=[];

      prev.push(vm);

      return [...prev];
    })

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  const ButtonComponent = () => {
    return (
      <>
        <button 
          onClick={() => fileRef?.current?.click()}
          className="uppercase bg-sky-400 text-xl text-white px-5 py-5 ease-in-out duration-75 hover:bg-sky-500 rounded-xl"
        >
          Crea un vocabolario
        </button>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          ref={fileRef}
          hidden
        />
      </>
      
    )
  }

  return (
    <main className="mx-[5%]">
      <h1 className="w-11/12  text-3xl font-semibold pt-10 pb-8">
        Vocabolari
      </h1>
      

      {vocabulariesMetadata == null ? (
        <div>Caricamento</div>
      ) : vocabulariesMetadata.length === 0 ? (
        <NoElementMenu
            Svg={DocumentPlus}
            svg_dimension="small"
            title="Nessun vocabolario trovato"
            text="Nessun vocabolario trovato nel database"
            ButtonComponent={ButtonComponent}
          />
      ) : (
        <>
          <ButtonComponent />
          <div className="flex flex-col md:space-y-4 space-y-2 md:items-start items-center pt-8">
            {vocabulariesMetadata.map((vocabulary,key) => (
              <VocabularyCard
                key={key}
                id={vocabulary.id}
                name={vocabulary.name}
                currentVersion={vocabulary.currentJarVersion}
                versions={vocabulary.allJarVersions}
                onUpload={onUpload(vocabulary)}
                onDelete={onDelete}
                onVersionUpdate={onVersionUpdate(vocabulary)}
              />
            ))}
          </div>
        </>
      )}
      
    </main>
  );
}
