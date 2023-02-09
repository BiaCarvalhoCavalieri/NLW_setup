import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
    date: Date
    onCompletedChanged: (completed: number) => void
}
interface HabitsInfo {
    possibleHabits: Array <{
        id: string;
        title: string;
        created_at: string;
    }>,
    completedHabits: string[];
}
export function HabitsList({ date, onCompletedChanged }: HabitsListProps){
    const [habitsInfo, sethabitsInfo] = useState<HabitsInfo>()

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(),
            }
        }).then(response => {
            sethabitsInfo(response.data)
        })
    },[])

    async function handleToggleHabit(habitId: string){
        await api.patch(`/habits/${habitId}/toggle`)

        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
        let completedHabits: string[] = []
        if (isHabitAlreadyCompleted){
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)

        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        } 
        sethabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })
        onCompletedChanged(completedHabits.length)
    }
    const isDataInPast = dayjs(date).endOf('day').isBefore(new Date())
    return (

        <div className="mt-6 flex flex-col gap-3">
            {habitsInfo?.possibleHabits.map(habit => {
                return (
                    <Checkbox.Root 
                        key={habit.id}
                        onCheckedChange = {() => handleToggleHabit(habit.id)}
                        checked = {habitsInfo.completedHabits.includes(habit.id)}
                        disabled={isDataInPast}
                        className="group flex items-center gap-3 focus:outline-none disabled:cursor-not-allowed"
                    >
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white"/>
                            </Checkbox.Indicator>
                        </div>
                        <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"> 
                            {habit.title}
                        </span>
                    </Checkbox.Root>
                )
            })}
        </div>
    )
}

function onCompletedChanged(length: any) {
    throw new Error('Function not implemented.');
}
