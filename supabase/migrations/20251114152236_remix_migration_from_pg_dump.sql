--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'ambassador',
    'user'
);


--
-- Name: assign_default_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_default_role() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: ambassador_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ambassador_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text NOT NULL,
    email text NOT NULL,
    motivation text NOT NULL,
    experience text,
    status text DEFAULT 'pending'::text NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ambassador_applications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: saved_lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    topic text NOT NULL,
    lesson_content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ambassador_applications ambassador_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_applications
    ADD CONSTRAINT ambassador_applications_pkey PRIMARY KEY (id);


--
-- Name: ambassador_applications ambassador_applications_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_applications
    ADD CONSTRAINT ambassador_applications_user_id_key UNIQUE (user_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: saved_lessons saved_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_lessons
    ADD CONSTRAINT saved_lessons_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_saved_lessons_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_lessons_created_at ON public.saved_lessons USING btree (created_at DESC);


--
-- Name: idx_saved_lessons_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_lessons_user_id ON public.saved_lessons USING btree (user_id);


--
-- Name: ambassador_applications update_ambassador_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ambassador_applications_updated_at BEFORE UPDATE ON public.ambassador_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: saved_lessons update_saved_lessons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_saved_lessons_updated_at BEFORE UPDATE ON public.saved_lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ambassador_applications ambassador_applications_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_applications
    ADD CONSTRAINT ambassador_applications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: ambassador_applications ambassador_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_applications
    ADD CONSTRAINT ambassador_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ambassador_applications Admins can update applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update applications" ON public.ambassador_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ambassador_applications Admins can view all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all applications" ON public.ambassador_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- Name: ambassador_applications Users can create their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own applications" ON public.ambassador_applications FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: saved_lessons Users can create their own saved lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own saved lessons" ON public.saved_lessons FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: saved_lessons Users can delete their own saved lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own saved lessons" ON public.saved_lessons FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: ambassador_applications Users can view their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own applications" ON public.ambassador_applications FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: saved_lessons Users can view their own saved lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own saved lessons" ON public.saved_lessons FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ambassador_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


