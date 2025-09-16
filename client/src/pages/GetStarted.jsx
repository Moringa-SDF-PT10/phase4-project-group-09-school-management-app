import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual
  const [openFAQ, setOpenFAQ] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 'Free', annual: 'Free' },
      description: 'Perfect for individual students',
      features: [
        'Access to basic courses',
        'Community support',
        'Limited storage (500MB)',
        'Basic analytics',
        'Email support'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: { monthly: 'KSh 999', annual: 'KSh 9,990' },
      period: { monthly: '/month', annual: '/year' },
      description: 'Ideal for serious learners',
      features: [
        'All Starter features',
        'Advanced courses',
        'Priority support',
        '5GB storage',
        'Progress tracking',
        'Certificate generation',
        'Mobile app access'
      ],
      buttonText: 'Get Started',
      popular: true,
      savings: 'Save 17%'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 'KSh 1,999', annual: 'KSh 19,990' },
      period: { monthly: '/month', annual: '/year' },
      description: 'For schools & institutions',
      features: [
        'All Standard features',
        'Premium courses',
        '24/7 support',
        '20GB storage',
        'Advanced analytics',
        'Custom certificates',
        'Teacher accounts',
        'Bulk student management'
      ],
      buttonText: 'Get Started',
      popular: false,
      savings: 'Save 17%'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 'Custom', annual: 'Custom' },
      description: 'Complete learning solution',
      features: [
        'All Premium features',
        'Unlimited storage',
        'Dedicated account manager',
        'White-label solution',
        'API access',
        'Custom integrations',
        'On-premise deployment',
        'Training & onboarding'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const features = [
    {
      title: 'Student Management',
      description: 'Manage student profiles, attendance, and performance tracking'
    },
    {
      title: 'Online Learning',
      description: 'Access to comprehensive course materials and interactive lessons'
    },
    {
      title: 'Fee Management',
      description: 'Streamlined billing, invoicing, and payment processing'
    },
    {
      title: 'Exam Management',
      description: 'Create, schedule, and grade exams with automated reporting'
    },
    {
      title: 'Communication Tools',
      description: 'Messaging, announcements, and parent-teacher communication'
    },
    {
      title: 'Reporting & Analytics',
      description: 'Detailed reports on student performance and institutional metrics'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer:
        'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your billing cycle.'
    },
    {
      question: 'Is there a setup fee?',
      answer:
        'No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.'
    },
    {
      question: 'Do you offer discounts for schools?',
      answer:
        'Yes, we offer special educational pricing for schools and institutions. Contact our sales team for more information.'
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept M-Pesa, credit cards, bank transfers, and other local payment methods for your convenience.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Affordable Plans for Every Learning Need
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your educational journey. All plans include our core features with no hidden costs.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-orange-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-orange-500 text-white text-sm font-semibold py-2 text-center">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price[billingCycle]}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">
                      {plan.period[billingCycle]}
                    </span>
                  )}
                </div>
                {plan.savings && billingCycle === 'annual' && (
                  <div className="text-green-600 text-sm font-medium mb-4">
                    {plan.savings}
                  </div>
                )}
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : plan.id === 'enterprise'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-10 text-center text-white mb-16 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Get Started Now</h2>
          <p className="text-xl text-orange-100 mb-6 max-w-3xl mx-auto">
            Ready to Simplify Your School Management? <br />
            Start your <span className="font-semibold">1-month free trial</span> today or book a personalized demo — no commitments, just smarter school administration made easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-md">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors shadow-md">
              Book a Demo
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-orange-500 transform transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-4 pb-4 text-gray-600 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Still have questions?{' '}
              <a href="#contact" className="text-orange-600 hover:text-orange-700 font-semibold">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
