"use client";
import React, { useState } from 'react';
import { axiosClient } from '@/lib/axiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@mantine/core';

const CalendlyLinkInput = () => {
  const [calendlyLink, setCalendlyLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const handleSubmit = async () => {
    if (!calendlyLink) return;
    
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });
    
    try {
      // Validate the URL format
      if (!calendlyLink.includes('calendly.com')) {
        throw new Error('Please enter a valid Calendly link');
      }
      
      await axiosClient.post(`/api/campaign/${campaignId}/calendly-link`, { calendlyLink });
      setMessage({ text: 'Calendly link updated successfully!', isError: false });
      
    } catch (error) {
      console.error('Error updating calendly link:', error);
      setMessage({ 
        text: error.message || 'Failed to update Calendly link. Please try again.', 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Connect Your Calendly</h2>
      <p className="text-gray-600 mb-4">
        Add your Calendly link to allow users to schedule meetings with you.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="calendlyLink" className="block text-sm font-medium text-gray-700 mb-1">
            Calendly Link
          </label>
          <input
            type="url"
            id="calendlyLink"
            value={calendlyLink}
            onChange={(e) => setCalendlyLink(e.target.value)}
            placeholder="https://calendly.com/your-username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {message.text && (
          <div className={`p-3 rounded-md ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className=" text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Calendly Link'}
        </Button>
      </div>
    </div>
  );
};

export default CalendlyLinkInput;