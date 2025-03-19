import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

interface AttendanceData {
  date: string;
  students: number;
  teachers: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-base font-semibold text-neutral-800 font-heading">Attendance Overview</CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
              <span className="text-xs text-neutral-500">Students</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-teal-500 rounded-full mr-1"></div>
              <span className="text-xs text-neutral-500">Teachers</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[60, 100]}
                ticks={[60, 70, 80, 90, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#1565C0"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="teachers" 
                stroke="#26A69A" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
