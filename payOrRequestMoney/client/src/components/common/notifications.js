import React from 'react';

import { notification } from 'antd';

notification.config({
  placement: 'topRight',
  bottom: 50,
  duration: 4.5,
});

export const alertInfo = (message = 'Notification', description = "", duration, key) => {
  notification.info({ message, description, duration, key });
};

export const alertError = (message = 'Notification', description = "") => {
  notification.error({ message, description, });
};

export const alertSuccess = (message = 'Notification', description = "") => {
  notification.success({ message, description, });
};

export const closeAlert = id => notification.close(id);