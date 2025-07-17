import React from 'react'
import { Users, Target, Award, Heart, User } from 'lucide-react'

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About urlz.lat
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to make link sharing smarter, faster, and more insightful for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            At urlz.lat, we believe that every link tells a story. Our platform empowers individuals and businesses 
            to create meaningful connections through smart URL shortening, comprehensive analytics, and branded link management. 
            We're committed to providing tools that not only shorten your links but also amplify your digital presence.
          </p>
        </div>

        {/* Founder Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet Our Founder</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Milton Diaz
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    at DunaTech, creator of Urlz.lat
                  </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    With over a decade of experience in software development and digital innovation, Milton brings a unique 
                    perspective to URL management and analytics. His passion for creating tools that simplify complex 
                    processes led to the creation of urlz.lat.
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Milton's background spans full-stack development, product management, and entrepreneurship. He believes 
                    in building technology that empowers users while maintaining the highest standards of privacy and security.
                  </p>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    "Every link tells a story, and our mission is to help you tell yours better. We're not just shortening 
                    URLs – we're creating connections that matter."
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://www.linkedin.com/in/miltondz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                  
                  <a
                    href="mailto:milton@urlz.lat"
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg transition-colors space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User-Centric</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Every feature we build is designed with our users in mind, ensuring simplicity without sacrificing power.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mb-6">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We strive for excellence in everything we do, from our code quality to our customer support.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mb-6">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Community</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We're building more than a tool – we're fostering a community of creators, marketers, and innovators.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-4">
                Founded in 2024, urlz.lat emerged from a simple observation: link sharing was becoming increasingly 
                important in our digital world, but existing solutions were either too complex or too limited.
              </p>
              <p className="text-lg leading-relaxed">
                We set out to create a platform that combines the simplicity of traditional URL shorteners with 
                the power of modern analytics and branding tools. Today, we're proud to serve thousands of users 
                who trust us with their most important links.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-white bg-opacity-20 rounded-full mb-4">
                <span className="text-4xl font-bold">2024</span>
              </div>
              <p className="text-xl font-semibold">Year Founded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}