import caller from './caller';

class _SubsribeService {
  subscribe = async (email: string) => {
    const data = new FormData();
    data.append('email', email);

    try {
      await caller.sharedInstance.request({
        method: 'POST',
        url: '/email/subscribe',
        data,
      });
      return true;
    } catch (error) {
      return false;
    }
  };
}

export default new _SubsribeService();
