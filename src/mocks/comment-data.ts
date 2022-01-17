import {
  datatype,
  internet,
  lorem
} from 'faker';
import { Comment } from '../types/comment';

export const makeFakeComment = (): Comment => ({
  id: datatype.string(),
  userName: internet.userName(),
  advantage: lorem.sentence(),
  disadvantage: lorem.sentence(),
  comment: lorem.sentences(),
  rating: datatype.number(),
  createAt: datatype.string(),
  guitarId: datatype.number(),
});

export const makeFakeCommentList = (count: number): Comment[] =>
  new Array(count).fill(null).map(() => makeFakeComment());
