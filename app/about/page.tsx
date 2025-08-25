import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            À propos de Pioloop
          </h1>

          <div className="prose prose-lg text-gray-700">
            <p className="mb-6">
              Pioloop est une plateforme innovante qui connecte les voyageurs
              avec des logements uniques et authentiques. Notre mission est de
              transformer l'expérience du voyage en offrant des hébergements qui
              racontent une histoire.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Notre Vision
            </h2>
            <p className="mb-6">
              Nous croyons que chaque voyage devrait être une aventure
              mémorable. En proposant des logements soigneusement sélectionnés,
              nous permettons aux voyageurs de découvrir des lieux
              extraordinaires et de créer des souvenirs inoubliables.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Pourquoi Pioloop ?
            </h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Logements uniques et authentiques</li>
              <li>Expérience utilisateur intuitive et moderne</li>
              <li>Service client réactif et personnalisé</li>
              <li>Communauté de voyageurs passionnés</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="mb-4">
              Pour toute question ou suggestion, n'hésitez pas à nous contacter
              :
            </p>
            <p className="text-purple-600 font-medium">contact@pioloop.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
