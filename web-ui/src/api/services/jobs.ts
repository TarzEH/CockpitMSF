import { rpcClient } from '../rpcClient';
import { Job } from '../../types';

export const jobsService = {
  async list(): Promise<Job[]> {
    const response = await rpcClient.jobList();
    return response.jobs || [];
  },

  async get(id: number): Promise<Job> {
    return rpcClient.jobInfo(id);
  },

  async stop(id: number): Promise<void> {
    await rpcClient.jobStop(id);
  },
};
