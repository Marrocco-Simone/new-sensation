import { apiGet } from "@/services/api"
import { getAccessToken } from "@auth0/nextjs-auth0"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {

  const url = (process.env.INTERNAL_SMARTGAME_URL ?? process.env.NEXT_PUBLIC_SMARTGAME_URL) + "/user/saveProfile"
  const { accessToken } = await getAccessToken();
  //const bearer_token = "Bearer " + token.accessToken

  console.log(accessToken)
  console.log(url)

  try{
    await apiGet<null>(url, accessToken)

  }catch(error){
    console.log("Errore in ricerca utente")
    console.dir(error);
    return NextResponse.json({error}, {status: 500});
  }
  return NextResponse.redirect(process.env.AUTH0_BASE_URL+"")
}