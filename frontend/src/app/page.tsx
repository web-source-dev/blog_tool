import Image from "next/image";
import Link from "next/link";
import GoogleAd from "../components/GoogleAd";
import LazyAd from "../components/LazyAd";
import FloatingAd from "../components/FloatingAd";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo and Navigation */}
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold font-serif">
                <span className="text-gray-900">Blog</span>
                <span className="text-orange-500">Tool</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/blog" className="text-base text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">Blog</Link>
              <Link href="/writers" className="text-base text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">Writers</Link>
              <Link href="/tools" className="text-base text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">Tools</Link>
              <Link href="/about" className="text-base text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">About Us</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-500 transition-colors duration-200 p-2 rounded-full hover:bg-orange-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
                Sign In
              </button>
            </div>
          </div>
          
          {/* Tagline and Stats */}
          <div className="py-12 border-t border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="max-w-2xl">
                <p className="text-lg text-gray-700">
                  Trusted writing and publishing platform when you need it most. <span className="font-semibold text-gray-900">Write more, be heard.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-10">
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">1M+ Readers</div>
                    <div className="text-xs text-gray-600 font-medium">Helped Each Month</div>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors duration-200">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15.232 5.232l-3.864 3.864m-2.5-2.5l3.864-3.864m-3.864 3.864l-3.864-3.864m2.5 2.5l3.864 3.864" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">500+ Expert</div>
                    <div className="text-xs text-gray-600 font-medium">Writers</div>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors duration-200">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">200+ Topics</div>
                    <div className="text-xs text-gray-600 font-medium">Covered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <GoogleAd 
            adSlot="TOP_BANNER_AD_SLOT"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: '90px' }}
          />
        </div>
      </div>

      {/* Main Content - Three Columns */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column */}
          <div className="space-y-12">
            {/* Writing Programs Section */}
            <div className="group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 text-sm font-bold uppercase tracking-wider shadow-sm">
                Writing Programs
              </div>
              <article className="bg-white border border-gray-200 p-8 mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group-hover:border-orange-200">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-3xl">✍️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      The Ultimate Guide to Blog Writing
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      Expert reviewed by <span className="text-orange-600">Sarah Johnson</span>, Professional Writer & Editor
                    </p>
                    <p className="text-sm text-gray-700 mb-6">
                      Master the art of creating engaging blog content that resonates with your audience and drives results...
                    </p>
                    <div className="flex items-center text-sm text-orange-600 font-semibold hover:text-orange-700 cursor-pointer group/link">
                      Read More 
                      <span className="ml-1 group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Writing Tools Section */}
            <div className="group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 text-sm font-bold uppercase tracking-wider shadow-sm">
                Writing Tools
              </div>
              <article className="bg-white border border-gray-200 p-8 mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group-hover:border-orange-200">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-3xl">🛠️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      Best Writing Apps for Productivity
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      By <span className="text-orange-600">Michael Chen</span>, Tech Writer & Productivity Expert
                    </p>
                    <p className="text-sm text-gray-700 mb-6">
                      Discover the top writing applications that will boost your productivity and streamline your workflow...
                    </p>
                    <div className="flex items-center text-sm text-orange-600 font-semibold hover:text-orange-700 cursor-pointer group/link">
                      Read More 
                      <span className="ml-1 group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Left Sidebar Ad */}
            <LazyAd 
              adSlot="LEFT_SIDEBAR_AD_SLOT"
              adFormat="auto"
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
              style={{ minHeight: '300px' }}
            />
          </div>

          {/* Center Column - Featured Article */}
          <div className="group">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 text-sm font-bold uppercase tracking-wider shadow-sm">
              Featured Story
            </div>
            <article className="bg-white border border-gray-200 mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group-hover:border-orange-200 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-purple-500/20"></div>
                <div className="relative z-10 text-center">
                  <span className="text-7xl mb-6 block">📝</span>
                  <span className="text-base text-gray-600 font-medium">Featured Image</span>
                </div>
              </div>
              <div className="p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  We're Sharing the Best Writing Tips of 2025, Tested by Professional Writers
                </h2>
                <p className="text-sm text-gray-600 mb-8 font-medium">
                  By <span className="text-orange-600">Emma Davis</span>, Professional Writer, <span className="text-orange-600">Jennifer Smith</span>, Content Strategist, and <span className="text-orange-600">Alex Brown</span>, Writing Coach
                </p>
                <p className="text-base text-gray-700 mb-8">
                  Discover proven writing techniques that will transform your content creation process. Our team of professional writers has tested and refined these methods to help you produce better content faster and more effectively.
                </p>
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  Read Full Article →
                </button>
              </div>
            </article>
          </div>

          {/* Right Column - Trending */}
          <div className="group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 text-sm font-bold uppercase tracking-wider shadow-sm">
              Trending
            </div>
            <div className="bg-white border border-gray-200 mt-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group-hover:border-blue-200 overflow-hidden">
              {[
                { title: "5 Surprising Benefits of Daily Writing", author: "Expert reviewed", time: "2 hours ago" },
                { title: "Expert-Tested: The 10 Best Writing Prompts", author: "By Lisa Wang and David Kim, Writing Coaches", time: "5 hours ago" },
                { title: "6 Reasons to Write for 15 Minutes Today", author: "Reviewed by Maria Garcia, Writing Therapist", time: "1 day ago" },
                { title: "We Tested 25 Top Writing Apps—These 8 Work Best", author: "By James Wilson and Rachel Lee", time: "2 days ago" }
              ].map((article, index) => (
                <article key={index} className="p-8 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100 last:border-b-0">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight hover:text-orange-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{article.author}</p>
                  <p className="text-xs text-gray-500 font-medium">{article.time}</p>
                </article>
              ))}
            </div>

            {/* Right Sidebar Ad */}
            <LazyAd 
              adSlot="RIGHT_SIDEBAR_AD_SLOT"
              adFormat="auto"
              className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        {/* Mid-page Banner Ad */}
        <div className="mt-16">
          <GoogleAd 
            adSlot="MID_PAGE_BANNER_AD_SLOT"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: '90px' }}
          />
        </div>

        {/* Our Review Board Section */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Review Board</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet our team of certified writing professionals who ensure every piece of content meets our high standards
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: "Sarah Johnson", title: "Writer & Editor", role: "Content Reviewer", avatar: "👩‍💼" },
                { name: "Michael Chen", title: "Tech Writer", role: "Writing Coach", avatar: "👨‍💻" },
                { name: "Emma Davis", title: "Professional Writer", role: "Editorial Lead", avatar: "👩‍🎨" },
                { name: "Jennifer Smith", title: "Content Strategist", role: "Strategy Advisor", avatar: "👩‍💼" },
                { name: "Alex Brown", title: "Writing Coach", role: "Education Specialist", avatar: "👨‍🏫" },
                { name: "Lisa Wang", title: "Writing Coach", role: "Community Manager", avatar: "👩‍💻" }
              ].map((expert, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200 mb-3">
                    {expert.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{expert.name}</h4>
                    <p className="text-xs text-gray-600">{expert.title}</p>
                    <p className="text-xs text-orange-600">{expert.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-lg text-gray-700 mb-10">
                Our team of certified writers and content professionals ensure our content is accurate, up-to-date, and engaging. We maintain the highest standards of quality and expertise in everything we publish.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-sm font-semibold self-start transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Meet the Team →
              </button>
            </div>
          </div>
        </section>

        {/* Tools and Resources Section */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tools and Resources</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access powerful writing tools and learn from expert-curated resources
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "Word Count Calculator", icon: "📝", color: "blue" },
                { name: "Readability Checker", icon: "📊", color: "green" },
                { name: "Plagiarism Detector", icon: "🔍", color: "purple" },
                { name: "Grammar Checker", icon: "✏️", color: "orange" },
                { name: "SEO Optimizer", icon: "🎯", color: "red" },
                { name: "Writing Timer", icon: "⏱️", color: "indigo" }
              ].map((tool, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg cursor-pointer transition-all duration-200 border border-gray-100 hover:border-orange-200 group">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                    <span className="text-base font-semibold text-gray-900">{tool.name}</span>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Learn the Science Behind Popular Writing Styles
              </h3>
              <div className="space-y-6">
                <button className="w-full bg-blue-100 text-blue-800 px-8 py-6 rounded-xl text-left hover:bg-blue-200 transition-colors duration-200 text-base font-semibold group">
                  <div className="flex items-center justify-between">
                    <span>Creative Writing</span>
                    <span className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </button>
                <button className="w-full bg-green-100 text-green-800 px-8 py-6 rounded-xl text-left hover:bg-green-200 transition-colors duration-200 text-base font-semibold group">
                  <div className="flex items-center justify-between">
                    <span>Technical Writing</span>
                    <span className="text-green-600 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </button>
                <button className="w-full bg-purple-100 text-purple-800 px-8 py-6 rounded-xl text-left hover:bg-purple-200 transition-colors duration-200 text-base font-semibold group">
                  <div className="flex items-center justify-between">
                    <span>Business Writing</span>
                    <span className="text-purple-600 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="mt-24 bg-gradient-to-br from-gray-50 to-orange-50 py-20 rounded-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Promise</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Our content empowers you wherever you are on your writing journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              { icon: "✍️", title: "Written by writing experts and journalists" },
              { icon: "🔍", title: "Fact-checked with research-backed content" },
              { icon: "✅", title: "Reviewed by professional writers and editors" },
              { icon: "🔄", title: "Updated to reflect the latest information" }
            ].map((promise, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-200">{promise.icon}</div>
                <p className="text-sm text-gray-700 font-medium">{promise.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-5 rounded-xl text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
              Read About Our Process →
            </button>
          </div>
        </section>

        {/* Recent Awards Section */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Recent Awards</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recognized for excellence in content creation and platform innovation
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "🏆 2024 Best Writing Platform",
              "⭐ 2023 Content Creator's Choice",
              "🚀 2023 Innovation in Publishing",
              "📝 2022 Best Blogging Website"
            ].map((award, index) => (
              <div key={index} className="bg-white border border-gray-200 text-gray-800 px-10 py-6 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg transition-all duration-200 hover:border-orange-200 cursor-pointer">
                {award}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Banner Ad */}
        <div className="mt-16">
          <GoogleAd 
            adSlot="BOTTOM_BANNER_AD_SLOT"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: '90px' }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-8">
                <span className="text-white">Blog</span>
                <span className="text-orange-500">Tool</span>
              </h3>
              <div className="mb-10">
                <p className="text-base text-gray-400 mb-8">Expert Writing Tips and Advice to Your Inbox</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 text-gray-900 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  />
                  <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-r-xl text-sm font-semibold transition-colors duration-200">
                    Sign Up
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                {["📱", "📘", "📷", "📌"].map((icon, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200 cursor-pointer">
                    <span className="text-sm">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-bold mb-8">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/blog" className="text-base hover:text-white transition-colors duration-200">Blog</Link></li>
                <li><Link href="/writers" className="text-base hover:text-white transition-colors duration-200">Writers</Link></li>
                <li><Link href="/tools" className="text-base hover:text-white transition-colors duration-200">Tools</Link></li>
                <li><Link href="/categories" className="text-base hover:text-white transition-colors duration-200">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-bold mb-8">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/help" className="text-base hover:text-white transition-colors duration-200">Help Center</Link></li>
                <li><Link href="/contact" className="text-base hover:text-white transition-colors duration-200">Contact</Link></li>
                <li><Link href="/faq" className="text-base hover:text-white transition-colors duration-200">FAQ</Link></li>
                <li><Link href="/community" className="text-base hover:text-white transition-colors duration-200">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-bold mb-8">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/privacy" className="text-base hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-base hover:text-white transition-colors duration-200">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-base hover:text-white transition-colors duration-200">Cookie Policy</Link></li>
                <li><Link href="/accessibility" className="text-base hover:text-white transition-colors duration-200">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-12 text-center text-gray-400">
            <p className="text-base mb-4">BlogTool's content is for informational and educational purposes only and should not be considered as professional writing advice.</p>
            <p className="text-sm">&copy; 2024 BlogTool Inc. — All rights reserved</p>
          </div>
        </div>
      </footer>

      {/* Floating Ads */}
      <FloatingAd 
        position="bottom-right"
        adSlot="FLOATING_BOTTOM_RIGHT_AD_SLOT"
        showCloseButton={true}
        autoHide={false}
      />
      
      <FloatingAd 
        position="top-right"
        adSlot="FLOATING_TOP_RIGHT_AD_SLOT"
        showCloseButton={true}
        autoHide={true}
        hideDelay={8000}
      />
    </div>
  );
}
