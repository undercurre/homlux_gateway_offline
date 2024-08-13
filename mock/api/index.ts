import auth from './auth';
import route from './route';
import user from './user';
import project from './project';
import sys from './sys';
import scene from './scene';

export default [...auth, ...route, ...user, ...sys, ...project, ...scene];
