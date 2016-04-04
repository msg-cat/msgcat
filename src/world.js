import ConnectionStore from './stores/ConnectionStore';
const world = new ConnectionStore(msgcatConfig);
window.world = world;
export default world
