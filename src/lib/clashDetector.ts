import { PlacementTest, ClashInfo } from '@/types/placement';

export function getTestDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
}

export function detectClashes(tests: PlacementTest[]): ClashInfo[] {
  const myUpcoming = tests.filter((t) => t.track === 'mine');
  const herUpcoming = tests.filter((t) => t.track === 'hers');

  const clashes: ClashInfo[] = [];

  for (const myTest of myUpcoming) {
    const myStart = getTestDateTime(myTest.testDate, myTest.testTime);
    const myDuration = myTest.durationMinutes || 90;
    const myEnd = new Date(myStart.getTime() + myDuration * 60 * 1000);

    for (const herTest of herUpcoming) {
      const herStart = getTestDateTime(herTest.testDate, herTest.testTime);
      const herDuration = herTest.durationMinutes || 90;
      const herEnd = new Date(herStart.getTime() + herDuration * 60 * 1000);

      // Compare dates
      if (myTest.testDate === herTest.testDate) {
        // Slot overlap: StartA < EndB and StartB < EndA
        const isTimeOverlap = myStart < herEnd && herStart < myEnd;

        if (isTimeOverlap) {
          clashes.push({
            test1: myTest,
            test2: herTest,
            type: 'direct_clash',
            description: `Slot overlap: ${myTest.companyName} (${myTest.testTime}) overlaps with ${herTest.companyName} (${herTest.testTime}).`,
          });
        } else {
          clashes.push({
            test1: myTest,
            test2: herTest,
            type: 'same_day',
            description: `Same-date scheduling: ${myTest.companyName} (${myTest.testTime}) and ${herTest.companyName} (${herTest.testTime}).`,
          });
        }
      }
    }
  }

  return clashes;
}
