import {Values} from './form';
export type ProposalPayload={values:Values;language:string;requestId:string;website:string};
export async function submitProposal(endpoint:string,payload:ProposalPayload):Promise<{ok:boolean;error?:string}> {
  const remote=!!endpoint;
  const response=await fetch(endpoint||'/api/propuestas',{method:'POST',redirect:'follow',credentials:'omit',headers:{'Content-Type':remote?'text/plain;charset=UTF-8':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)});
  if(!response.ok)return {ok:false,error:response.status===503?'not_configured':'submission_failed'};
  const result=await response.json();
  if(result.ok!==true)return {ok:false,error:result.error||'submission_failed'};
  if(remote&&result.requestId!==payload.requestId)return {ok:false,error:'invalid_acknowledgement'};
  return {ok:true};
}
