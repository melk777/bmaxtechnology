"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AcessoVisitasPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/visitas-acesso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (!response.ok) { setError("Código de acesso inválido."); return; }
    router.replace(params.get("return_to") === "/visitas" ? "/visitas" : "/visitas");
    router.refresh();
  }

  return <main className="access-page"><section className="access-card"><img src="/logo-bmax.png" alt="Bmaxbrasil" /><p>ÁREA RESTRITA</p><h1>Operação<br />comercial Bmax.</h1><span>Informe o código de acesso fornecido pela administração.</span><form onSubmit={submit}><label>Código de acesso<input value={code} onChange={(event) => setCode(event.target.value)} type="password" autoComplete="current-password" required autoFocus /></label>{error && <small role="alert">{error}</small>}<button type="submit" disabled={loading}>{loading ? "Verificando..." : "Acessar mapa de visitas →"}</button></form><a href="/">← Voltar ao site público</a></section></main>;
}
