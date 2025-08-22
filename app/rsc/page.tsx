import { getAgents, getTeams } from '@/lib/api'
import HomeRSC from '@/components/HomeRSC'
export const dynamic = 'force-dynamic'
export default async function Page(){
  const [agents,teams]=await Promise.all([getAgents(),getTeams()])
  return <HomeRSC initialAgents={agents} initialTeams={teams}/>
}
