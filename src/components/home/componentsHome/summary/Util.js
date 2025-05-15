import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';


export function getTimeAgo(date) {
  const parsedDate = parseISO(date);
  const daysDifference = differenceInDays(new Date(), parsedDate);

  if (daysDifference > 7) {
    // Si pasaron más de 7 días, mostrar fecha "normal"
    return format(parsedDate, 'dd/MM/yyyy');
  } else {
    // Si pasaron menos de 7 días, mostrar "Hace X tiempo"
    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: es });
  }
}

