import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MoodChartProps {
  data: { day: string; mood: number }[];
}

export const MoodChart = ({ data }: MoodChartProps) => {
  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Map mood rating to emoji
      const getMoodEmoji = (mood: number) => {
        if (mood >= 4) return "😄";
        if (mood >= 3) return "🙂";
        if (mood >= 2) return "😐";
        if (mood >= 1) return "😟";
        return "😢";
      };

      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-[#f56a9b]">{`Mood: ${payload[0].value} ${getMoodEmoji(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#888888' }}
        />
        <YAxis 
          domain={[0, 5]} 
          ticks={[1, 2, 3, 4, 5]} 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#888888' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#f56a9b"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
