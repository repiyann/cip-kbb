import { debounce } from "lodash"

export const debouncedSearch = debounce((searchTerm: string, router) => {
    const query = searchTerm ? { search: searchTerm } : {};
    const urlParams = new URLSearchParams(window.location.search);
    const currentActiveTab = urlParams.get('activeTab') || 'users';

    router.get(route('rbac.index', { activeTab: currentActiveTab, ...query }), {
        replace: true,
        preserveState: true,
    });
}, 300);
