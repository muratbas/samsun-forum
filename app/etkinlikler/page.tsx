'use client'

import React, { useState } from 'react'

export default function EventsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
            <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Jump to Date</p>
            <div className="flex min-w-full flex-col">
              <div className="flex items-center p-1 justify-between">
                <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-tight flex-1 text-center">October 2024</p>
                <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mt-2">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">S</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">M</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">T</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">W</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">T</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">F</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold flex h-8 w-full items-center justify-center">S</p>
                <button className="h-8 w-full text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium col-start-3"><div className="flex size-full items-center justify-center rounded-full">1</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">2</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">3</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">4</div></button>
                <button className="h-8 w-full text-white text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full bg-primary">5</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">6</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">7</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">8</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">9</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">10</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">11</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">12</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">13</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">14</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">15</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">16</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">17</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">18</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">19</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">20</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">21</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">22</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">23</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">24</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">25</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">26</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">27</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">28</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">29</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">30</div></button>
                <button className="h-8 w-full text-text-primary-light dark:text-text-primary-dark text-xs font-medium"><div className="flex size-full items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20">31</div></button>
              </div>
            </div>
          </div>
          <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
            <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Categories</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input defaultChecked className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" type="checkbox"/>
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Konserler</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" type="checkbox"/>
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Festivaller</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input defaultChecked className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" type="checkbox"/>
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Spor</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" type="checkbox"/>
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Sanat & Kültür</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" type="checkbox"/>
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Topluluk Buluşmaları</span>
              </label>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 text-sm mb-4">
          <a className="text-text-secondary-light dark:text-text-secondary-dark hover:underline" href="#">Forum</a>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Etkinlikler</span>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">Samsun Etkinlik Takvimi</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">View, add, and filter events happening in Samsun.</p>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span className="truncate">Add New Event</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full sm:w-64">
            <div className="flex h-10 items-center justify-center rounded-lg bg-black/5 dark:bg-border-dark p-1 text-sm font-medium">
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-surface-light dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-text-primary-light dark:has-[:checked]:text-text-primary-dark text-text-secondary-light dark:text-text-secondary-dark transition-all">
                <span className="truncate">Month</span>
                <input defaultChecked className="invisible w-0" name="calendar-view" type="radio" value="Month"/>
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-surface-light dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-text-primary-light dark:has-[:checked]:text-text-primary-dark text-text-secondary-light dark:text-text-secondary-dark transition-all">
                <span className="truncate">Week</span>
                <input className="invisible w-0" name="calendar-view" type="radio" value="Week"/>
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-surface-light dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-text-primary-light dark:has-[:checked]:text-text-primary-dark text-text-secondary-light dark:text-text-secondary-dark transition-all">
                <span className="truncate">List</span>
                <input className="invisible w-0" name="calendar-view" type="radio" value="List"/>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button className="h-10 px-4 rounded-lg text-sm font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Today</button>
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className="grid grid-cols-7 text-center font-bold text-sm text-text-secondary-light dark:text-text-secondary-dark border-b border-border-light dark:border-border-dark">
            <div className="py-4">Sun</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Mon</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Tue</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Wed</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Thu</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Fri</div>
            <div className="py-4 border-l border-border-light dark:border-border-dark">Sat</div>
          </div>
          <div className="grid grid-cols-7 grid-rows-5 h-[720px]">
            {/* Calendar Days */}
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">29</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">30</div>
            
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">1</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">2</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">3</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">4</div>
            <div className="p-2 border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium bg-primary/10 dark:bg-primary/20">
              <span className="font-bold text-primary">5</span>
              <div className="mt-1 space-y-1">
                <div className="p-1.5 rounded bg-primary text-white text-xs font-semibold leading-tight text-left cursor-pointer hover:bg-primary/90">Samsunspor Match</div>
              </div>
            </div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">6</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">7</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">8</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">9</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">10</div>
            <div className="p-2 border-r border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium">
              11
              <div className="mt-1 space-y-1">
                <div className="p-1.5 rounded bg-blue-500 text-white text-xs font-semibold leading-tight text-left cursor-pointer hover:bg-blue-600">Teknofest Karadeniz</div>
              </div>
            </div>
            {/* Rest of the days */}
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`p-2 ${i % 7 !== 6 ? 'border-r' : ''} ${i < 13 ? 'border-b' : ''} border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium`}>
                {12 + i}
              </div>
            ))}
            <div className="p-2 border-r text-text-secondary-light dark:text-text-secondary-dark">1</div>
            <div className="p-2 text-text-secondary-light dark:text-text-secondary-dark">2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
