'use client';

import { Grid, Button, Paper, Text } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { IconBackspace } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NumberPad({ value, onChange, disabled }: NumberPadProps) {
  const buttons = useMemo(() => [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '*', value: '*' },
    { label: '0', value: '0' },
    { label: '#', value: '#' },
    { label: '+', value: '+' },
    { label: 'Space', value: ' ' }
  ], []);
  
  const validKeys = useMemo(() => 
    new Set([...buttons.map(b => b.value), 'Backspace', ' ']), 
  [buttons]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (disabled) return;
      const key = event.key;
      if (validKeys.has(key)) {
        event.preventDefault();
        if (key === 'Backspace') {
          handleBackspace();
        } else {
          onChange(value + key);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [value, onChange, disabled, validKeys]);

  const handleClick = (digit: string) => {
    onChange(value + digit);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <Paper radius="xl" p="lg">
      <Paper 
        p="md" 
        mb="md" 
        radius="lg" 
        className="border border-white/10"
      >
        <Text 
          size="md" 
          className="font-mono tracking-wider text-white"
          style={{ minHeight: '2rem' }}
        >
          {value || <span className="text-gray-500">Enter a number</span>}
        </Text>
      </Paper>
      
      <Grid gutter="xs">
        {buttons.map((button) => (
          <Grid.Col span={button.label === 'Space' ? 8 : 4} key={button.label}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                fullWidth
                size="lg"
                radius="xl"
                variant="light"
                color="violet"
                className="number-pad-button font-mono h-14"
                onClick={() => handleClick(button.value)}
                disabled={disabled}
              >
                {button.label}
              </Button>
            </motion.div>
          </Grid.Col>
        ))}
        <Grid.Col span={4}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              fullWidth
              size="lg"
              radius="xl"
              variant="subtle"
              color="red"
              className="number-pad-button h-14"
              onClick={handleBackspace}
              disabled={!value || disabled}
            >
              <IconBackspace size={20} />
            </Button>
          </motion.div>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
