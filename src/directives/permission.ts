import type { App, Directive } from 'vue';
import { usePermission } from '@/composables';

export default function setupPermissionDirective(app: App) {
  const { hasPermission } = usePermission();

  function updateElVisible(
    el: HTMLElement,
    permission: ApiAuth.UserRole['roleLevel'] | ApiAuth.UserRole['roleLevel'][]
  ) {
    if (!permission) {
      throw new Error(`need roles: like v-permission="'admin'", v-permission="['admin', 'test]"`);
    }
    if (!hasPermission(permission)) {
      el.parentElement?.removeChild(el);
    }
  }

  const permissionDirective: Directive<HTMLElement, ApiAuth.UserRole['roleLevel'] | ApiAuth.UserRole['roleLevel'][]> = {
    mounted(el, binding) {
      updateElVisible(el, binding.value);
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value);
    }
  };

  app.directive('permission', permissionDirective);
}
