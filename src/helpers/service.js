const localServices = {};

export const registerLocalService = (type, handler) => {
  localServices[type] = handler;
};

export const isLocalService = (type) => {
  return !!localServices[type];
};

export const runLocalService = async (type, ...params) => {
  if (localServices[type]) {
    return await localServices[type](...params);
  }
  return false;
};

export default { registerLocalService, isLocalService, runLocalService };
