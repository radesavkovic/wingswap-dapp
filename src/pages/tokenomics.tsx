import { nanoid } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import { ReactInstance, useCallback, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Cell, Pie, PieChart } from 'recharts';
import { Button, Flex, Heading } from 'theme-ui';

const data = [
  { name: 'Founder', value: 100 },
  { name: 'Developer', value: 100 },
  { name: 'Treasury', value: 150 },
  { name: 'Community', value: 650 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function download(chart: ReactInstance) {
  // eslint-disable-next-line react/no-find-dom-node
  const chartSVG = (findDOMNode(chart) as Element)?.children[0];

  const svgURL = new XMLSerializer().serializeToString(chartSVG);
  const svgBlob = new Blob([svgURL], { type: 'image/svg+xml;charset=utf-8' });
  FileSaver.saveAs(svgBlob, nanoid() + '.svg');
}

export default function Chart() {
  const chart = useRef<any>();
  const exportSVG = useCallback(() => {
    download(chart.current as any);
  }, []);

  return (
    <Flex
      sx={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background',
      }}
    >
      <Heading variant="styles.h1">{'Tokenomics'}</Heading>

      <PieChart ref={(_chart) => (chart.current = _chart)} width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          stroke="none"
          paddingAngle={5}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      <Button onClick={exportSVG}>Export SVG</Button>
    </Flex>
  );
}
