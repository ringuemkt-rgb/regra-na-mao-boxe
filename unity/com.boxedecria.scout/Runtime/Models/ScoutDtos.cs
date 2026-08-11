using System;
using System.Collections.Generic;

namespace BoxeDeCria.Scout
{
    [Serializable]
    public sealed class ScoutDossierDto
    {
        public string id;
        public string slug;
        public string status;
        public string sport;
        public string name;
        public string nickname;
        public string category;
        public string team;
        public string photo_url;
        public IdentityDto identity = new();
        public RecordDto record = new();
        public List<ScoutFightDto> fights = new();
        public List<ScoutMetricDto> metrics = new();
        public List<ScoutClaimDto> claims = new();
        public List<ScoutSourceDto> sources = new();
        public string last_updated_at;
    }

    [Serializable] public sealed class IdentityDto
    {
        public string birth_date;
        public int age;
        public string birth_place;
        public string nationality;
        public string stance;
        public float height_cm;
        public float reach_cm;
        public string coach;
    }

    [Serializable] public sealed class RecordDto
    {
        public int wins;
        public int losses;
        public int draws;
        public int no_contests;
    }

    [Serializable] public sealed class ScoutFightDto
    {
        public string id;
        public string date;
        public string event_name;
        public string opponent;
        public string result;
        public string method;
        public int round;
        public string time;
        public List<string> source_ids = new();
    }

    [Serializable] public sealed class ScoutMetricDto
    {
        public string key;
        public string label;
        public float value;
        public string unit;
        public string derivation;
        public List<string> source_ids = new();
        public float confidence;
        public int sample_size;
        public string limitation;
    }

    [Serializable] public sealed class ScoutClaimDto
    {
        public string id;
        public string text;
        public string status;
        public float confidence;
        public List<ScoutEvidenceDto> evidence = new();
    }

    [Serializable] public sealed class ScoutEvidenceDto
    {
        public string source_id;
        public string field;
        public string excerpt;
        public float timestamp_seconds;
    }

    [Serializable] public sealed class ScoutSourceDto
    {
        public string id;
        public string kind;
        public string title;
        public string publisher;
        public string url;
        public string retrieved_at;
        public float reliability;
    }

    [Serializable] public sealed class ScoutDossierListResponse { public List<ScoutDossierDto> items = new(); }
}
