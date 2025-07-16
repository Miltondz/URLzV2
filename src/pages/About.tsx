import React from 'react'
import { Users, Target, Award, Heart } from 'lucide-react'

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