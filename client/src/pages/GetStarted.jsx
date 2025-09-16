import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 'Ksh 5,000', annual: 'Ksh 55,000' },
      period: { monthly: '/month', annual: '/year' },
      description: 'Perfect for small schools getting started',
      features: [
        'Access all features',
        'Manage up to 200 students',
        'Unlimited Support',
        'Basic analytics dashboard',
        'Cancel anytime'
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: { monthly: 'KSh 7,500', annual: 'KSh 85,000' },
      period: { monthly: '/month', annual: '/year' },
      description: 'Ideal for growing schools',
      features: [
        'All Starter features',
        'Manage up to 400 students',
        'Priority support',
        'Advanced reporting',
        'Certificate generation'
      ],
      buttonText: 'Start Learning',
      popular: true,
      savings: 'Save 17%',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 'KSh 10,000', annual: 'KSh 120,000' },
      period: { monthly: '/month', annual: '/year' },
      description: 'For established institutions',
      features: [
        'All Standard features',
        'Manage up to 700 students',
        '24/7 dedicated support',
        'Custom branding',
        'Bulk operations'
      ],
      buttonText: 'Get Premium',
      popular: false,
      savings: 'Save 10%',

    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 'Custom', annual: 'Custom' },
      description: 'Complete solution for large institutions',
      features: [
        'All Premium features',
        'Unlimited students',
        'Dedicated account manager',
        'White-label solution',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      popular: false,
    }
  ];

  const features = [
    {
      title: 'Student Management',
      description: 'Complete student profiles, attendance tracking, and performance monitoring',
      icon: '👨‍🎓'
    },
    {
      title: 'Online Learning',
      description: 'Interactive courses, video lessons, and downloadable materials',
      icon: '📚'
    },
    {
      title: 'Fee Management',
      description: 'Automated billing, payment tracking, and financial reporting',
      icon: '💳'
    },
    {
      title: 'Exam Management',
      description: 'Create, schedule, and grade exams with detailed analytics',
      icon: '📝'
    },
    {
      title: 'Communication Tools',
      description: 'Messaging, announcements, and parent-teacher communication portal',
      icon: '💬'
    },
    {
      title: 'Reporting & Analytics',
      description: 'Comprehensive reports on student performance and institutional metrics',
      icon: '📊'
    }
  ];

  const testimonials = [
    {
      quote: "SchoolBest transformed our school's management. Everything is now streamlined and efficient.",
      author: "Jane Mwangi",
      role: "Principal, Nairobi Academy",
      avatar: "J"
    },
    {
      quote: "The pricing is very affordable for Kenyan schools. The ROI was evident within the first month.",
      author: "David Ochieng",
      role: "IT Manager, Mombasa High",
      avatar: "D"
    },
    {
      quote: "Our teachers love the intuitive interface and students enjoy the learning experience.",
      author: "Sarah Akinyi",
      role: "Director, Kisumu Learning Center",
      avatar: "S"
    }
  ];

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, credit/debit cards, bank transfers, and mobile money payments. For institutional plans, we also offer invoice-based billing with flexible payment terms.",
      category: "Billing & Payments"
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged a prorated amount for the remainder of your billing cycle. Downgrades will take effect at the start of your next billing cycle.",
      category: "Account Management"
    },
    {
      question: "Is there a setup fee or hidden costs?",
      answer: "No, there are no setup fees or hidden costs. The price you see is what you pay. All plans include access to all features with no additional charges for standard usage.",
      category: "Billing & Payments"
    },
    {
      question: "Do you offer discounts for educational institutions?",
      answer: "Yes, we offer special educational pricing for schools, universities, and other educational institutions. Contact our sales team with your institution details to learn about our educational discounts and custom pricing options.",
      category: "Pricing"
    },
    {
      question: "How does the free trial work?",
      answer: "Our 14-day free trial gives you full access to all Premium features. No credit card is required to start your trial. At the end of the trial period, you can choose to upgrade to a paid plan or continue with our free Starter plan.",
      category: "Account Management"
    },
    {
      question: "What happens to my data if I cancel my subscription?",
      answer: "If you cancel your subscription, your account will be downgraded to the free Starter plan at the end of your billing period. You won't lose any data, but some features may become limited based on the free plan's restrictions.",
      category: "Account Management"
    },
    {
      question: "How do I get support?",
      answer: "All plans include email support with varying response times. Premium and Enterprise plans include priority support with faster response times and dedicated account management. We also have a comprehensive knowledge base and community forum for self-service support.",
      category: "Support"
    },
    {
      question: "Can I request a feature?",
      answer: "Absolutely! We welcome feature requests and feedback from our users. You can submit feature requests through our support portal, and our product team regularly reviews these suggestions for future updates.",
      category: "Product"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We comply with data protection regulations and regularly undergo security audits. For Enterprise plans, we offer additional security features and compliance certifications.",
      category: "Security"
    },
    {
      question: "Do you offer training for new users?",
      answer: "Yes, we provide comprehensive onboarding materials, video tutorials, and documentation for all users. Premium and Enterprise plans include personalized onboarding sessions and dedicated training resources for your team.",
      category: "Support"
    }
  ];

  // Group FAQs by category
  const faqCategories = {
    'All': faqs,
    'Billing & Payments': faqs.filter(faq => faq.category === 'Billing & Payments'),
    'Account Management': faqs.filter(faq => faq.category === 'Account Management'),
    'Pricing': faqs.filter(faq => faq.category === 'Pricing'),
    'Support': faqs.filter(faq => faq.category === 'Support'),
    'Product': faqs.filter(faq => faq.category === 'Product'),
    'Security': faqs.filter(faq => faq.category === 'Security')
  };

  const filteredFAQs = activeCategory === 'All' ? faqs : faqCategories[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-6 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
            🎯 Affordable Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan & Get Started
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a small academy or a large institution, we offer affordable plans tailored
            to your needs—only pay for the package you choose after the free trial.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                billingCycle === 'annual'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Annual Billing
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'ring-2 ring-orange-500 shadow-2xl' 
                  : 'shadow-xl'
              }`}
            >
              {/* Most Popular Badge - Fixed positioning */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                  : 'bg-gradient-to-br from-white to-gray-50'
              }`}></div>
              
              {/* Content */}
              <div className="relative z-10 bg-white/95 backdrop-blur-sm m-1 rounded-2xl p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price[billingCycle]}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1 text-sm">
                        {plan.period[billingCycle]}
                      </span>
                    )}
                  </div>
                  {plan.savings && billingCycle === 'annual' && (
                    <div className="text-green-600 text-sm font-medium mt-2 bg-green-50 px-2 py-1 rounded-full inline-block">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
                      : plan.id === 'enterprise'
                      ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-md'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-md'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 md:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-orange-600">Succeed</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform includes all the tools you need for effective teaching and learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-orange-600">Schools Nationwide</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of educational institutions already transforming their operations with SchoolBest
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-orange-600">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about SchoolBest plans, features, and support
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* FAQ Categories */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto px-6">
                {Object.keys(faqCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeCategory === category
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-gray-200">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="transition-colors hover:bg-gray-50">
                  <button
                    className="w-full px-6 py-5 text-left focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded mr-4">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          activeFAQ === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {activeFAQ === index && (
                    <div className="px-6 pb-5">
                      <div className="pl-9">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                Contact Support
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students who are already experiencing the SchoolBest difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105">
              Schedule a Demo
            </button>
          </div>
          <p className="text-orange-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;