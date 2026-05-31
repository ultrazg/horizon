import { PrivateMediaGet } from '@/api/private'

export async function fetchPrivateMediaUrl(eid: string): Promise<string> {
  const res = await PrivateMediaGet({ eid })

  return res.data.data.url
}
