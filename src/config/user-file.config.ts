import { FileStatusesEnum } from "../types";

export const userFilesStatusesMap: { [key in FileStatusesEnum]: string } = {
  [FileStatusesEnum.SIGNED]: '⚪ Загружено',
  [FileStatusesEnum.ACCEPTED]: '🟢 Принято',
  [FileStatusesEnum.REJECTED]: '🔴 Отклонено',
  [FileStatusesEnum.REPEATED]: '🟡 Повторяется',
};
