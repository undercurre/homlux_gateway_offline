import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { useBoolean } from '@/hooks';

export const useSetupStore = defineStore('setup-store', () => {
  const { bool: visible, setTrue: show, setFalse: hide } = useBoolean();

  interface Config {
    name: string;
    mode: 'light' | 'lock';
  }

  const config = reactive<Config>({ name: 'config', mode: 'lock' });

  /** 设置配置 */
  function setConfig(conf: Partial<Config>) {
    Object.assign(config, conf);
  }

  return {
    visible,
    show,
    hide,
    config,
    setConfig
  };
});
