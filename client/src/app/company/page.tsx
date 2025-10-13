'use client';

import React from 'react';

export default function CompanyPage() {
	// Simple page to ensure /company route exists
	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
				<h1 className="text-3xl font-bold mb-4">Company</h1>
				<p className="text-gray-600">This is the company page. The /company route is now available.</p>
			</div>
		</div>
	);
}
