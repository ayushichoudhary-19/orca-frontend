'use client';

import { Grid, Button, Paper } from '@mantine/core';
import { useEffect } from 'react';

interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NumberPad({ value, onChange, disabled }: NumberPadProps) {
  const buttons = ['+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', 'Space'];
  const validKeys = new Set([...buttons, ' ', 'Backspace']);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (disabled) return;
      const key = event.key;
      if (validKeys.has(key)) {
        event.preventDefault();
        if (key === 'Backspace') {
          handleBackspace();
        } else if (key === ' ') {
          onChange(value + ' ');
        } else {
          onChange(value + key);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [value, onChange, disabled, handleBackspace, validKeys]);

  const handleClick = (digit: string) => {
    onChange(value + (digit === 'Space' ? ' ' : digit));
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <Paper radius="2xl" p="lg" mt="xl" shadow="md" className="bg-white/10 backdrop-blur-md border border-white/10">
      <Grid gutter="sm">
        {buttons.map((digit) => (
          <Grid.Col span={digit === 'Space' ? 8 : 4} key={digit}>
            <Button
              fullWidth
              size="lg"
              radius="xl"
              variant="outline"
              className="font-mono text-white"
              onClick={() => handleClick(digit)}
              disabled={disabled}
              style={{ height: '3.5rem' }}
            >
              {digit}
            </Button>
          </Grid.Col>
        ))}
        <Grid.Col span={4}>
          <Button
            fullWidth
            size="lg"
            radius="xl"
            variant="light"
            className="font-mono text-white"
            onClick={handleBackspace}
            disabled={!value || disabled}
            style={{ height: '3.5rem' }}
          >
            ⌫
          </Button>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
