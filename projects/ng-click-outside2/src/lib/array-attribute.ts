export function arrayAttribute (events: string | string[]) {
  if (Array.isArray(events)) {
    return events
  } else {
    return events.split(',')
  }
}
